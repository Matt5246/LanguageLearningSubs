import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { loadAutoScrollState } from '@/lib/utils';
import axios from 'axios';


interface HardWord {
    learnState?: number;
    word: string | undefined;
    translation?: string;
    pos?: string;
    lemma?: string;
    createdAt?: Date;
    learnedAt?: Date | null;
    sentences?: sentences[];
    repetitions: number;    // Number of successful reviews
    dueDate: Date;     // Date for next review
}

interface Subtitle {
    userId?: string;
    SubtitleId?: string | null;
    youtubeUrl?: string;
    subtitleTitle?: string;
    sourceLang?: string;
    targetLang?: string;
    episode?: number;
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface SubtitleData {
    word?: string;
    text?: string;
    translation?: string;
    end?: number | GLfloat;
    start?: number | GLfloat;
}

export const calculateNextReviewDate = (
    repetitions: number
): Date => {
    const intervals = [5 / (24 * 60), 30 / (24 * 60), 1, 3, 7, 14, 30]; // Review intervals in days based on repetitions
    const nextInterval = repetitions < intervals.length ? intervals[repetitions-1] : intervals[intervals.length - 1];
    const nextReviewDate = new Date();
    nextReviewDate.setTime(nextReviewDate.getTime() + nextInterval * 24 * 60 * 60 * 1000);
    console.log("Next Review Date (Local):", nextReviewDate.toLocaleString());
    return nextReviewDate;
};
// export const updateHardWordsAsync = createAsyncThunk(
//     'subtitles/updateHardWordsAsync',
//     async ({ SubtitleId, hardWords }) => {
//       const response = await axios.post('/api/hardWords/update', {
//         SubtitleId,
//         hardWords,
//       });
//       return response.data;
//     }
//   );
export interface SubtitlesState {
    subtitles: Subtitle[];
    selectedSubtitle: String | null;
    playedSeconds: number;
    autoScrollEnabled: boolean;
}

const initialState: SubtitlesState = {
    subtitles: [],
    selectedSubtitle: null,
    playedSeconds: 0,
    autoScrollEnabled: loadAutoScrollState() || false,
};

const subtitlesSlice = createSlice({
    name: 'subtitles',
    initialState,
    reducers: {
        addSubtitle(state, action: PayloadAction<Subtitle>) {
            state.subtitles.push(action.payload);
        },
        deleteSubtitle(state, action: PayloadAction<string>) {
            state.subtitles = state.subtitles.filter(subtitle => subtitle.SubtitleId !== action.payload);
        },
        clearSubtitles(state) {
            state.subtitles = [];
        },
        getSubtitle(state, action: PayloadAction<string>): void {
            state.subtitles.find(subtitle => subtitle.SubtitleId === action.payload);
        },
        updateSubtitle(state, action: PayloadAction<Subtitle>) {
            const { SubtitleId } = action.payload;
            const index = state.subtitles.findIndex(sub => sub.SubtitleId === SubtitleId);
            if (index !== -1) {
                state.subtitles[index] = { ...state.subtitles[index], ...action.payload };
            }
        },
        setSelectedSubtitle(state, action: PayloadAction<string | null>) {
            state.selectedSubtitle = action.payload;
        },
        setPlayedSeconds(state, action: PayloadAction<number>) {
            state.playedSeconds = action.payload;
        },
        toggleAutoScroll(state) {
            state.autoScrollEnabled = !state.autoScrollEnabled;
            localStorage.setItem('autoScrollEnabled', JSON.stringify(state.autoScrollEnabled));
        },
        swapTranslation(state, action: PayloadAction<string>) {
            const subtitleId = action.payload;
            const subtitle = state.subtitles.find(sub => sub.SubtitleId === subtitleId);

            if (subtitle) {
                subtitle.subtitleData = subtitle?.subtitleData?.map(sub => ({
                    ...sub,
                    text: sub.translation,
                    translation: sub.text
                }))
            }
        },
        initializeSubtitles(state, action: PayloadAction<Subtitle[]>) {
            state.subtitles = action.payload;
        },
        updateHardWords(state, action: PayloadAction<{ SubtitleId: string, hardWords: HardWord[] }>) {
            const { SubtitleId, hardWords } = action.payload;
            const subtitle = state.subtitles.find(sub => sub.SubtitleId === SubtitleId);
            if (subtitle) {
                subtitle.hardWords = hardWords;
            }
        },
        updateWordSRS(
            state,
            action: PayloadAction<{ SubtitleId: string; word: string; quality: number }>
        ) {
            const { SubtitleId, word, quality } = action.payload;
            const subtitle = state.subtitles.find(sub => sub.SubtitleId === SubtitleId);
            if (subtitle?.hardWords) {
                const hardWord = subtitle.hardWords.find(hw => hw.word === word);
                if (hardWord) {
                    if (quality >= 3) {
                        hardWord.repetitions += 1; // Increment repetitions for successful reviews
                    } else {
                        hardWord.repetitions = 0; // Reset for failed reviews
                    }
                    // Update dueDate
                    hardWord.dueDate = calculateNextReviewDate(hardWord.repetitions);
        
                    // Optionally update learnState based on repetitions
                    hardWord.learnState = Math.min(
                        (hardWord.repetitions / 5) * 100, // Scale repetitions to a percentage
                        100
                    );
        
                    console.log('Updated Word SRS:', {
                        word,
                        repetitions: hardWord.repetitions,
                        dueDate: hardWord.dueDate,
                        learnState: hardWord.learnState,
                    });
                }
                
            }
        }
        
        
           
    },
});


export const subtitles = (state: SubtitlesState) => state.subtitles;
export const {
    addSubtitle,
    clearSubtitles,
    getSubtitle,
    updateSubtitle,
    initializeSubtitles,
    deleteSubtitle,
    setSelectedSubtitle,
    setPlayedSeconds,
    toggleAutoScroll,
    swapTranslation,
    updateHardWords,
    updateWordSRS,
} = subtitlesSlice.actions;


export const selectFlashCardData = createSelector(
    (state: any) => state.subtitle.subtitles,
    (subtitles) => {
        if (subtitles && subtitles.length > 0) {
            return subtitles?.map((subtitle: Subtitle) => ({
                SubtitleId: subtitle.SubtitleId,
                subtitleTitle: subtitle.subtitleTitle,
                hardWords: subtitle.hardWords,
            }));
        }
        return [];
    }
);
export const selectedSubtitle = createSelector(
    (state: any) => state.subtitle.subtitles,
    (state: any) => state.subtitle.selectedSubtitle,
    (subtitles: any, selectedSubtitle: string | null | undefined) => {
        if (Array.isArray(subtitles) && subtitles.length > 0 && selectedSubtitle) {
            return subtitles.find((subtitle: any) => subtitle.SubtitleId === selectedSubtitle) || null;
        }
        return null;
    }
);
export const updateSubtitleTranslation = (state: any, action: any) => {
    const { SubtitleId, subtitleData } = action.payload;

    const index = state.subtitles.findIndex((sub: any) => sub.SubtitleId === SubtitleId);
    if (index !== -1) {
        state.subtitles[index].subtitleData = subtitleData;
    }
};

export const selectSubtitleStats = createSelector(
    (state: {subtitle: SubtitlesState}) => state.subtitle.subtitles,
    (subtitles) => {
        if (!subtitles || subtitles.length === 0) {
            return {
                totalSubtitles: 0,
                totalWords: 0,
                totalWordsTrend: 0,
                totalSubtitlesTrend: 0,
                totalTime: 0,
                lastActivity: null,
                activityData: [],
            };
        }

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const totalWords = subtitles.reduce(
            (acc, sub) => acc + (sub.hardWords?.length || 0),
            0
        );

        const totalWordsTrend = subtitles
            .filter(sub => new Date(sub.updatedAt || 0) >= oneMonthAgo)
            .reduce((acc, sub) => acc + (sub.hardWords?.length || 0), 0);
       
        const totalSubtitlesTrend = subtitles.filter(
            sub => new Date(sub.updatedAt || 0) >= oneMonthAgo
        ).length;

        const totalTime = subtitles.reduce((acc, sub) => {
            const lastRowTime = sub.subtitleData?.length ? sub.subtitleData[sub.subtitleData.length - 1].end : 0;
            return acc + lastRowTime!;
        }, 0);

        const lastActivity = subtitles.reduce(
            (latest, sub) => {
                const subDate = new Date(sub.createdAt || 0);
                return new Date(latest) > subDate ? latest : subDate.toISOString();
            },
            new Date(0).toISOString()
        );

        const activityByDate = subtitles.reduce((acc, sub) => {
            const date = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : 'Invalid Date';
            acc[date] = (acc[date] || 0) + (sub.hardWords?.length || 0);
            return acc;
        }, {} as Record<string, number>);

        const activityData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
            return {
                date: dateStr,
                words: activityByDate[dateStr] || 0,
            };
        }).reverse();

        return {
            totalSubtitles: subtitles.length,
            totalWords,
            totalWordsTrend,
            totalSubtitlesTrend,
            totalTime,
            lastActivity,
            activityData,
        };
    }
);

export const selectSRSFlashcards = createSelector(
    (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles,
    subtitles => {
        const now = new Date();
        return subtitles.flatMap(sub =>
            (sub.hardWords || [])
                .filter(hw => 
                    // Include words that:
                    // 1. Have no repetitions (new words)
                    // 2. Have a dueDate that's in the past or equal to now
                    (!hw.repetitions || hw.repetitions === 0) || 
                    (hw.dueDate && new Date(hw.dueDate) <= now)
                )
                .map(hw => ({
                    ...hw,
                    SubtitleId: sub.SubtitleId,
                    subtitleTitle: sub.subtitleTitle,
                }))
        ).sort((a, b) => {
            // Sort order:
            // 1. Due words first (by due date)
            // 2. Then new words
            // 3. Then waiting words
            if (!a.repetitions && !b.repetitions) return 0;
            if (!a.repetitions) return 1;
            if (!b.repetitions) return -1;
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }
);

export const selectSRSStats = createSelector(
    (state: { subtitle: SubtitlesState }) => state.subtitle.subtitles,
    subtitles => {
        const allWords = subtitles.flatMap(sub => sub.hardWords || []);
        const now = new Date();

        return {
            totalWords: allWords.length,
            dueWords: allWords.filter(hw => 
                // Count words that:
                // 1. Have no repetitions (new words)
                // 2. Have a dueDate that's in the past or equal to now
                (!hw.repetitions || hw.repetitions === 0) || 
                (hw.dueDate && new Date(hw.dueDate) <= now)
            ).length,
            // Changed mastery threshold to 5 repetitions
            masteredWords: allWords.filter(hw => hw.repetitions >= 5).length,
            wordsWithSRS: allWords.filter(hw => hw.repetitions > 0).length,
        };
    }
);

export default subtitlesSlice.reducer;


