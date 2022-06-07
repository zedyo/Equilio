import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { preferenceData: [], isLoading: true }

export const getPreferenceData = createAsyncThunk(
  'preferences/getPreferenceData',
  async (preferenceSlice, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/preferences')
      return data.preferences
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Preferences')
    }
  }
)

export const postPreferenceData = createAsyncThunk(
  'preferences/postPreferenceData',
  async (preferenceData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/preference/`,
        {
          preferenceData,
        }
      )
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der Preferences')
    }
  }
)

const preferenceSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    fillPreferences: (state, actions) => {
      state.preferenceData = actions
    },
  },
  extraReducers: {
    [getPreferenceData.pending]: (state) => {
      state.isLoading = true
    },
    [getPreferenceData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.preferenceData = payload
    },
    [getPreferenceData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [postPreferenceData.pending]: (state) => {
      state.isLoading = true
    },
    [postPreferenceData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.preferenceData.push(payload)
    },
    [postPreferenceData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { fillPreferences } = preferenceSlice.actions

export default preferenceSlice.reducer
