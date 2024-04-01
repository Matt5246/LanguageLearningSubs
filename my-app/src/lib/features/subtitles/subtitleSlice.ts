import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Subtitle {
    SubtitleId?: string;
    userId?: string;
    youtubeUrl?: string;
    subtitleTitle?: string;
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
}

export interface SubtitleData {
    text: string;
    translation: string;
    duration: number;
    offset: number;
}

export interface HardWord {
    word: string;
    translation: string;
    pos: string; // Part of speech
    lemma: string;
}

export interface SubtitlesState {
    subtitles: Subtitle[];
}

const initialState: SubtitlesState = {
    subtitles: loadSubtitlesFromStorage(),
};

const subtitlesSlice = createSlice({
    name: 'subtitles',
    initialState,
    reducers: {
        addSubtitle(state, action: PayloadAction<Subtitle>) {
            state.subtitles.push(action.payload);
            saveSubtitlesToStorage(state.subtitles);
        },
        clearSubtitles(state) {
            state.subtitles = [];
            saveSubtitlesToStorage([]);
        },
        getSubtitle(state, action: PayloadAction<string>): void {
            state.subtitles.find(subtitle => subtitle.SubtitleId === action.payload);
        },
    },
});

export const subtitles = (state: SubtitlesState) => state.subtitles;
export const { addSubtitle, clearSubtitles, getSubtitle } = subtitlesSlice.actions;
function loadSubtitlesFromStorage(): Subtitle[] {
    if (typeof window !== 'undefined') {
        const storedSubtitles = localStorage.getItem('subtitles');
        return storedSubtitles ? JSON.parse(storedSubtitles) : [];
    }
    return [];
}
function saveSubtitlesToStorage(subtitles: Subtitle[]): void {
    localStorage.setItem('subtitles', JSON.stringify(subtitles));
}
export default subtitlesSlice.reducer;
