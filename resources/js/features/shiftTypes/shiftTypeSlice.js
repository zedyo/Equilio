import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { shiftTypesData: [], isLoading: true }

export const getShiftTypesData = createAsyncThunk(
  'shiftTypes/getShiftTypesData',
  async (shiftTypesSlice, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/shift_types')
      return data.shift_types
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Shift Types')
    }
  }
)

export const postShiftTypesData = createAsyncThunk(
  'shiftTypes/postShiftTypesData',
  async (shiftTypesData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/shift_types/`,
        {
          shiftTypesData,
        }
      )
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der Shift Types')
    }
  }
)

export const updateShiftTypesData = createAsyncThunk(
  'shiftTypes/updateShiftTypesData',
  async (shiftTypeData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/shift_types/${shiftTypeData.id}`,
        {
          shiftTypeData,
        }
      )
      return data.shift_type
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim updaten des Shift Types')
    }
  }
)

export const deleteShiftTypesData = createAsyncThunk(
  'shiftTypes/deleteShiftTypesData',
  async (shift_type_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/shift_types/${shift_type_id}`
      )
      return data.deleted_shift_type
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von des Shift Types')
    }
  }
)

const shiftTypeSlice = createSlice({
  name: 'shiftTypes',
  initialState,
  reducers: {
    fillShiftTypes: (state, actions) => {
      state.shiftTypesData = actions
    },
  },
  extraReducers: {
    [getShiftTypesData.pending]: (state) => {
      state.isLoading = true
    },
    [getShiftTypesData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftTypesData = payload
    },
    [getShiftTypesData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [postShiftTypesData.pending]: (state) => {
      state.isLoading = true
    },
    [postShiftTypesData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftTypesData.push(payload)
    },
    [postShiftTypesData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [updateShiftTypesData.pending]: (state) => {
      state.isLoading = true
    },
    [updateShiftTypesData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      const shiftType = state.shiftTypesData.filter(
        (shiftType) => shiftType.id !== payload.id
      )
      state.shiftTypeData = { ...shiftType, payload }
    },
    [updateShiftTypesData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [deleteShiftTypesData.pending]: (state) => {
      state.isLoading = true
    },
    [deleteShiftTypesData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.shiftTypesData = state.shiftTypesData.filter(
        (shift_type) => shift_type.id !== payload.id
      )
    },
    [deleteShiftTypesData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { fillShiftTypes } = shiftTypeSlice.actions

export default shiftTypeSlice.reducer
