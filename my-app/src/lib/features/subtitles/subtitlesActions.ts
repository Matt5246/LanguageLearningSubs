import { fetchSubtitlesFromDB, updateSubtitleInDB } from '../../prismadb'
import { Dispatch } from 'redux';

export const fetchSubtitlesAction = (userId: string) => async (dispatch: Dispatch) => {
    try {
        const subtitles = await fetchSubtitlesFromDB(userId);
        dispatch({ type: 'FETCH_SUBTITLES_SUCCESS', payload: subtitles });
    } catch (error: any) {
        dispatch({ type: 'FETCH_SUBTITLES_FAILURE', payload: error.message });
    }
};

export const updateSubtitleAction = (subtitleId: string, updatedSubtitle: string) => async (dispatch: Dispatch) => {
    try {
        const updatedSubtitleData = await updateSubtitleInDB(subtitleId, updatedSubtitle);
        dispatch({ type: 'UPDATE_SUBTITLE_SUCCESS', payload: updatedSubtitleData });
    } catch (error: any) {
        dispatch({ type: 'UPDATE_SUBTITLE_FAILURE', payload: error.message });
    }
};
