import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/store/auth-slice'

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store