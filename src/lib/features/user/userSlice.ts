import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

interface UserState {
    isLoggedIn: boolean;
    userData: UserData | null;
    isLoading: boolean;
    error: string | null;
}

interface UserData {
    name?: string;
    email?: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    userData: null,
    isLoading: false,
    error: null,
};



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload;

        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userData = null;
        }
    },

});

export const { login, logout } = userSlice.actions;

export const selectUserData = (state: RootState) => state.user.userData;



export default userSlice.reducer;
