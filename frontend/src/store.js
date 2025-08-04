import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/user'

export const store = configureStore({
    reducer: {
        user: userReducer
    },
})