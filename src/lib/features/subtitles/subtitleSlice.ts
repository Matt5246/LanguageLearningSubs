import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createSelector } from '@reduxjs/toolkit';





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
} = subtitlesSlice.actions;


export const selectFlashCardData = createSelector(
    (state: any) => state.subtitle.subtitles,
    (subtitles) => {
        return subtitles?.map((subtitle: Subtitle) => ({
            SubtitleId: subtitle.SubtitleId,
            subtitleTitle: subtitle.subtitleTitle,
            hardWords: subtitle.hardWords,
        }));
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

// function loadSubtitlesFromStorage(): Subtitle[] {
//     if (typeof window !== 'undefined') {
//         const storedSubtitles = localStorage.getItem('subtitles');
//         if (storedSubtitles) {
//             const subtitles = JSON.parse(storedSubtitles);
//             if (subtitles.length > 0) {
//                 return subtitles;
//             }
//         }
//         return []
//     }
//     return [];
// }
function loadAutoScrollState(): boolean {
    if (typeof window !== 'undefined') {
        const storedAutoScrollState = localStorage.getItem('autoScrollEnabled');
        return storedAutoScrollState ? JSON.parse(storedAutoScrollState) : true;
    }
    return true;
}

// export const startPeriodicUpdates = () => (dispatch: any) => {
//     const interval = setInterval(() => {
//         dispatch(updateDataPeriodically());
//     }, 10 * 60000); //x * 60s

//     return () => clearInterval(interval);
// };

// const updateDataPeriodically = () => (dispatch: any) => {
//     console.log('Updating or adding data periodically...');
// };

export default subtitlesSlice.reducer;


