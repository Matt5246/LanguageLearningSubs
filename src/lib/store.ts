import { configureStore } from '@reduxjs/toolkit'
import subtitleSlice from './features/subtitles/subtitleSlice'
import userSlice from './features/user/userSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            subtitle: subtitleSlice,
            user: userSlice
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']