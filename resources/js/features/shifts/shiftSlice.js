import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { shiftsData: [], isLoading: true }

export const getShiftsData = createAsyncThunk(
  'shifts/getShiftsData',
  async (shiftsSlice, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/shifts')
      return data.shifts
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Shifts')
    }
  }
)

export const postShiftsData = createAsyncThunk(
  'shifts/postShiftsData',
  async (shiftsData, thunkAPI) => {
    try {
      const { data } = await axios.post(`http://127.0.0.1:8000/api/shifts/`, {
        shiftsData,
      })
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der Shifts')
    }
  }
)

export const updateShiftsData = createAsyncThunk(
  'shifts/updateShiftsData',
  async (shiftsData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/shifts/${shiftsData.id}`,
        {
          shiftsData,
        }
      )
      return data.shift
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim updaten der Shift')
    }
  }
)

export const deleteShiftsData = createAsyncThunk(
  'shifts/deleteShiftsData',
  async (shift_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/shifts/${shift_id}`
      )
      return data.deleted_shift
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von der Shift')
    }
  }
)

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    fillShifts: (state, actions) => {
      state.shiftsData = actions
    },
  },
  extraReducers: {
    [getShiftsData.pending]: (state) => {
      state.isLoading = true
    },
    [getShiftsData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftsData = payload
    },
    [getShiftsData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [postShiftsData.pending]: (state) => {
      state.isLoading = true
    },
    [postShiftsData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftsData.push(payload)
    },
    [postShiftsData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [updateShiftsData.pending]: (state) => {
      state.isLoading = true
    },
    [updateShiftsData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      const shift = state.shiftsData.filter((shift) => shift.id !== payload.id)
      state.shiftsData = { ...shift, payload }
    },
    [updateShiftsData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [deleteShiftsData.pending]: (state) => {
      state.isLoading = true
    },
    [deleteShiftsData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftsData = state.shiftsData.filter(
        (shift) => shift.id !== payload.id
      )
    },
    [deleteShiftsData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { fillShifts } = shiftsSlice.actions

export default shiftsSlice.reducer
