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

export const getPreferencesByEmployee = createAsyncThunk(
  'preferences/getPreferencesByEmployee',
  async (employeeId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/preferencesByEmployee/${employeeId}`
      )
      return data.preferences
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim Abholen der eigenen Präferenzen'
      )
    }
  }
)

// preferenceData = { employee_id, shift_id, level: 'preferred'|'valid'|'blocked' }
export const postPreferenceData = createAsyncThunk(
  'preferences/postPreferenceData',
  async (preferenceData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/preference/`,
        { preferenceData }
      )
      return data.preference
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim Speichern der Präferenz')
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
  extraReducers: (builder) => {
    builder
      .addCase(getPreferenceData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPreferenceData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.preferenceData = payload
      })
      .addCase(getPreferenceData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(getPreferencesByEmployee.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.preferenceData = payload
      })
      .addCase(postPreferenceData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postPreferenceData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        // Upsert nach (employee_id, shift_id): vorhandenen Eintrag
        // entfernen, bei 'valid' nicht neu aufnehmen (= neutral).
        state.preferenceData = state.preferenceData.filter(
          (p) =>
            !(
              Number(p.employee_id) === Number(payload.employee_id) &&
              Number(p.shift_id) === Number(payload.shift_id)
            )
        )
        if (payload.level && payload.level !== 'valid') {
          state.preferenceData.push(payload)
        }
      })
      .addCase(postPreferenceData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
  },
})

export const { fillPreferences } = preferenceSlice.actions

export default preferenceSlice.reducer
