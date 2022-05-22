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

export const updatePreferenceData = createAsyncThunk(
  'preferences/updatePreferenceData',
  async (preferenceData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/preferences/${preferenceData.id}`,
        {
          preferenceData,
        }
      )
      return data.preference
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim updaten des Preferences')
    }
  }
)

export const deletePreferencesData = createAsyncThunk(
  'preferences/deletePreferencesData',
  async (preferenceData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/preference/`,
        {
          preferenceData,
        }
      )
      return data.deleted_preference
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von des preferences')
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

    [updatePreferenceData.pending]: (state) => {
      state.isLoading = true
    },
    [updatePreferenceData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      const preference = state.preferenceData.filter(
        (preference) => preference.id !== payload.id
      )
      state.preferenceData = { ...preference, payload }
    },
    [updatePreferenceData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [deletePreferencesData.pending]: (state) => {
      state.isLoading = true
    },
    [deletePreferencesData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.preferenceData = state.preferenceData.filter(
        (preference) => preference.id !== payload.id
      )
    },
    [deletePreferencesData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { fillPreferences } = preferenceSlice.actions

export default preferenceSlice.reducer
