import { configureStore } from '@reduxjs/toolkit'
import subtitleSlice from './features/subtitles/subtitleSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            subtitle: subtitleSlice
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']