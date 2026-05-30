import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../services/authService'

const initialState = {
    user: null,
    isLoading: false,
    error: null
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await authService.register(payload)
            console.log(response.data)
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Internal error'
            console.log(error.response?.data)
            return rejectWithValue(errorMessage)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        clearAuthError: state => {
            state.error = null
        }
    },
    extraReducers: builder => {
        builder.addCase(registerUser.pending, state => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload?.data
            state.isLoading = false
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
    }
})

export const authReducer = authSlice.reducer
export const { clearAuthError } = authSlice.actions

export const selectNewUser = state => state.auth
