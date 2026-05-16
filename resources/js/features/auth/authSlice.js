import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API = 'http://127.0.0.1:8000'

// status: 'loading' (Prüfung läuft) | 'authenticated' | 'guest'
const initialState = { user: null, status: 'loading', error: null }

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/api/user`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue('guest')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      await axios.get(`${API}/sanctum/csrf-cookie`)
      const { data } = await axios.post(`${API}/api/login`, { email, password })
      return data
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.email?.[0] ||
        error?.response?.data?.message ||
        'Anmeldung fehlgeschlagen.'
      return thunkAPI.rejectWithValue(msg)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.post(`${API}/api/logout`)
  } catch (error) {
    // Auch bei Fehler lokal abmelden.
  }
  return true
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload
        state.status = 'authenticated'
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.status = 'guest'
      })
      .addCase(login.pending, (state) => {
        state.error = null
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload
        state.status = 'authenticated'
        state.error = null
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.error = payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'guest'
      })
  },
})

export const selectAuth = (store) => store.auth
export const selectIsLeitung = (store) => store.auth.user?.role === 'leitung'

export default authSlice.reducer
