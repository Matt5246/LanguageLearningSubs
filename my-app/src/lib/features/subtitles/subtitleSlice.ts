import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createSelector } from '@reduxjs/toolkit';

export interface Subtitle {
    SubtitleId?: String;
    youtubeUrl?: String;
    subtitleTitle?: String;
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
}

export interface SubtitleData {
    text: String;
    translation?: String;
    duration?: Number;
    offset?: Number;
}

export interface HardWord {
    id?: String
    hardWordId: String
    word: String;
    translation?: String;
    pos?: String; // Part of speech
    lemma?: String;
    learnState?: Number;
    sentences?: sentences[]
}
export interface sentences {
    id?: String
    sentence: String
    translation?: String
}
export interface SubtitlesState {
    subtitles: Subtitle[]
    selectedSubtitle: String | null
}

const initialState: SubtitlesState = {
    subtitles: loadSubtitlesFromStorage(),
    selectedSubtitle: null
};

const subtitlesSlice = createSlice({
    name: 'subtitles',
    initialState,
    reducers: {
        addSubtitle(state, action: PayloadAction<Subtitle>) {
            state.subtitles.push(action.payload);
            saveSubtitlesToStorage(state.subtitles);
        },
        deleteSubtitle(state, action: PayloadAction<string>) {
            state.subtitles = state.subtitles.filter(subtitle => subtitle.SubtitleId !== action.payload);
        },
        clearSubtitles(state) {
            state.subtitles = [];
            saveSubtitlesToStorage([]);
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
        initializeSubtitles(state, action: PayloadAction<Subtitle[]>) {
            state.subtitles = action.payload;
            saveSubtitlesToStorage(state.subtitles)
        },
    },
});


export const subtitles = (state: SubtitlesState) => state.subtitles;
export const { addSubtitle, clearSubtitles, getSubtitle, updateSubtitle, initializeSubtitles, deleteSubtitle, setSelectedSubtitle } = subtitlesSlice.actions;

export const selectFlashCardData = createSelector(
    (state: any) => state.subtitle.subtitles,
    (subtitles) => {
        return subtitles.map((subtitle: Subtitle) => ({
            SubtitleId: subtitle.SubtitleId,
            subtitleTitle: subtitle.subtitleTitle,
            hardWords: subtitle.hardWords,
        }));
    }
);

function loadSubtitlesFromStorage(): Subtitle[] {
    if (typeof window !== 'undefined') {
        const storedSubtitles = localStorage.getItem('subtitles');
        if (storedSubtitles) {
            const subtitles = JSON.parse(storedSubtitles);
            if (subtitles.length > 0) {
                return subtitles;
            }
        }
        return []
    }
    return [];
}

function saveSubtitlesToStorage(subtitles: Subtitle[]): void {
    localStorage.setItem('subtitles', JSON.stringify(subtitles));
}

export const startPeriodicUpdates = () => (dispatch: any) => {
    const interval = setInterval(() => {
        dispatch(updateDataPeriodically());
    }, 10 * 60000); //x * 60s

    return () => clearInterval(interval);
};

const updateDataPeriodically = () => (dispatch: any) => {
    console.log('Updating or adding data periodically...');
};

export default subtitlesSlice.reducer;


