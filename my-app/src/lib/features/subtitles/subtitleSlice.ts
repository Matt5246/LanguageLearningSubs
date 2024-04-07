import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchSubtitlesFromDB, updateSubtitleInDB } from '../../prismadb';
import { RootState } from '../../store';


export interface Subtitle {
    SubtitleId?: string;
    youtubeUrl?: string;
    subtitleTitle?: string;
    subtitleData?: SubtitleData[];
    hardWords?: HardWord[];
}

export interface SubtitleData {
    text: string;
    translation?: string;
    duration?: number;
    offset?: number;
}

export interface HardWord {
    word: string;
    translation?: string;
    pos?: string; // Part of speech
    lemma?: string;
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
                state.subtitles[index] = action.payload;
            }
        },
        initializeSubtitles(state, action: PayloadAction<Subtitle[]>) {
            state.subtitles = action.payload;
            saveSubtitlesToStorage(state.subtitles)
        },
    },
});

export const startPeriodicUpdates = () => (dispatch: any) => {
    const interval = setInterval(() => {
        dispatch(updateDataPeriodically());
    }, 10 * 60000); //x * 60s

    return () => clearInterval(interval);
};

const updateDataPeriodically = () => (dispatch: any) => {
    console.log('Updating or adding data periodically...');
};

export const subtitles = (state: SubtitlesState) => state.subtitles;
export const { addSubtitle, clearSubtitles, getSubtitle, updateSubtitle, initializeSubtitles, deleteSubtitle } = subtitlesSlice.actions;


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


export default subtitlesSlice.reducer;

