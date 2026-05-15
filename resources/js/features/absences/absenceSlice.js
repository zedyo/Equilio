import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const API = 'http://127.0.0.1:8000/api'

const initialState = { absenceData: [], isLoading: true }

export const getAbsenceData = createAsyncThunk(
  'absences/getAbsenceData',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/absences`)
      return data.absences
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim Abholen der Abwesenheiten')
    }
  }
)

export const postAbsenceData = createAsyncThunk(
  'absences/postAbsenceData',
  async (absence, thunkAPI) => {
    try {
      const { data } = await axios.post(`${API}/absences`, absence)
      return data.absence
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim Anlegen der Abwesenheit')
    }
  }
)

export const deleteAbsenceData = createAsyncThunk(
  'absences/deleteAbsenceData',
  async (absenceId, thunkAPI) => {
    try {
      const { data } = await axios.delete(`${API}/absences/${absenceId}`)
      return data.deleted_absence
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim Löschen der Abwesenheit')
    }
  }
)

const absenceSlice = createSlice({
  name: 'absences',
  initialState,
  reducers: {
    fillAbsences: (state, actions) => {
      state.absenceData = actions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAbsenceData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAbsenceData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.absenceData = payload
      })
      .addCase(getAbsenceData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(postAbsenceData.fulfilled, (state, { payload }) => {
        if (payload) state.absenceData.push(payload)
      })
      .addCase(deleteAbsenceData.fulfilled, (state, { payload }) => {
        if (payload != null) {
          state.absenceData = state.absenceData.filter(
            (a) => a.id !== payload.id
          )
        }
      })
  },
})

export const { fillAbsences } = absenceSlice.actions

export default absenceSlice.reducer
