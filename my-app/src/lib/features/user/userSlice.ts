import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signIn, signOut, useSession } from 'next-auth/react';



export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async () => {
        const { data: session, status } = await useSession();

        if (status === 'authenticated') {
            const userData = {
                name: session.user?.name ?? '',
                email: session.user?.email ?? '',
            };
            return userData;
        } else {
            throw new Error('User is not authenticated');
        }
    }
);
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.userData = action.payload;
                state.error = null;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch user data';
            });
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
