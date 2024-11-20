import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { loadAutoScrollState } from '@/lib/utils';



interface SRSData {
    interval: number;       // Days until next review
    easeFactor: number;     // Multiplier for interval
    repetitions: number;    // Number of successful reviews
    dueDate: string;       // Next review date
    lastReviewed: string;  // Last review date
}

interface HardWord {
    learnState?: number;
    word: string | undefined;
    translation?: string;
    pos?: string;
    lemma?: string;
    createdAt?: string;
    learnedAt?: string | null;
    sentences?: sentences[];
    srs?: SRSData;         // Spaced Repetition System data
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

interface HardWord {
    learnState?: number;
    word: string | undefined;
    translation?: string;
    pos?: string; // Part of speech
    lemma?: string;
    createdAt?: string;
    learnedAt?: string | null;
    sentences?: sentences[];
}

interface sentences {
    sentence: string
    translation?: string
}
const calculateNextReview = (
    currentInterval: number,
    easeFactor: number,
    quality: number // 0-5 rating of how well the word was remembered
): { interval: number; easeFactor: number } => {
    let newEaseFactor = easeFactor;
    let newInterval = currentInterval;

    // Adjust ease factor based on performance
    newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Calculate new interval
    if (quality < 3) {
        // Failed recall - reset intervals
        newInterval = 1;
    } else {
        if (currentInterval === 0) {
            newInterval = 1;
        } else if (currentInterval === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(currentInterval * newEaseFactor);
        }
    }

    return { interval: newInterval, easeFactor: newEaseFactor };
};
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
        updateWordSRS(state, action: PayloadAction<{SubtitleId: string, word: string, quality: number; // 0-5 rating
            }>){
            const { SubtitleId, word, quality } = action.payload;
            const subtitle = state.subtitles.find(sub => sub.SubtitleId === SubtitleId);
            if (subtitle?.hardWords) {
                const hardWord = subtitle.hardWords.find(hw => hw.word === word);
                if (hardWord) {
                    const now = new Date();
                    if (!hardWord.srs) {
                        // Initialize SRS data for new words
                        hardWord.srs = {
                            interval: 0,
                            easeFactor: 2.5,
                            repetitions: 0,
                            dueDate: now.toISOString(),
                            lastReviewed: now.toISOString()
                        };
                    }

                    const { interval, easeFactor } = calculateNextReview(
                        hardWord.srs.interval,
                        hardWord.srs.easeFactor,
                        quality
                    );

                    const nextReview = new Date();
                    nextReview.setDate(nextReview.getDate() + interval);

                    hardWord.srs = {
                        interval,
                        easeFactor,
                        repetitions: hardWord.srs.repetitions + 1,
                        dueDate: nextReview.toISOString(),
                        lastReviewed: now.toISOString()
                    };

                    // Update learnState based on SRS progress
                    hardWord.learnState = Math.min(
                        Math.round((hardWord.srs.repetitions / 8) * 100),
                        100
                    );
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



// Add new selector for SRS-based flashcards
export const selectSRSFlashcards = createSelector(
    (state: any) => state.subtitle.subtitles,
    (subtitles) => {
        if (!subtitles || subtitles.length === 0) return [];

        const now = new Date();
        const allWords = subtitles.flatMap((subtitle: Subtitle) => 
            (subtitle?.hardWords || []).map(word => ({
            ...word,
            SubtitleId: subtitle.SubtitleId,
            subtitleTitle: subtitle.subtitleTitle
            }))
        );

        // Filter and sort words based on SRS data
        return allWords
            .filter((word: HardWord )=> {
                if (!word.srs) return true; // New words that need to be learned
                return new Date(word.srs.dueDate) <= now; // Words due for review
            })
            .sort((a: { srs: { dueDate: string | number | Date; }; }, b: { srs: { dueDate: string | number | Date; }; }) => {
                // Prioritize words in this order:
                // 1. New words (no SRS data)
                // 2. Overdue words
                // 3. Words due today
                if (!a.srs && !b.srs) return 0;
                if (!a.srs) return -1;
                if (!b.srs) return 1;

                const aDueDate = new Date(a.srs.dueDate);
                const bDueDate = new Date(b.srs.dueDate);
                return aDueDate.getTime() - bDueDate.getTime();
            });
    }
);

// Selector for SRS statistics
export const selectSrsStats = createSelector(
    (state: any) => state.subtitle.subtitles,
    (subtitles) => {
        const now = new Date();
        const allWords = subtitles.flatMap((subtitle: Subtitle) => subtitle.hardWords || []);
        
        const totalWords = allWords.length;
        const wordsWithSRS = allWords.filter((word: HardWord )=> word.srs).length;
        const dueWords = allWords.filter((word: HardWord ) => 
            word.srs && new Date(word.srs.dueDate) <= now
        ).length;
        
        const masteredWords = allWords.filter((word: HardWord ) => 
            word.srs && word.srs.interval >= 30
        ).length;

        const upcomingReviews = allWords.reduce((acc: {[key: string]: number}, word: any) => {
            if (word.srs) {
                const dueDate = new Date(word.srs.dueDate).toLocaleDateString();
                acc[dueDate] = (acc[dueDate] || 0) + 1;
            }
            return acc;
        }, {});

        return {
            totalWords,
            wordsWithSRS,
            dueWords,
            masteredWords,
            upcomingReviews: Object.entries(upcomingReviews)
                .sort(([dateA], [dateB]) => 
                    new Date(dateA).getTime() - new Date(dateB).getTime()
                )
                .slice(0, 7) 
        };
    }
);



export default subtitlesSlice.reducer;


