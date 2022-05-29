import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { workingHoursDiffsData: [], isLoading: true }

export const getWorkingHoursDiffData = createAsyncThunk(
  'workingHoursDiff/getWorkingHoursDiffData',
  async (workingHoursDiff, thunkAPI) => {
    try {
      const { data } = await axios.get(
        'http://127.0.0.1:8000/api/working_hours_diffs'
      )
      return data.working_hours_diffs
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim abholen von Working Hours Diffs'
      )
    }
  }
)

export const postWorkingHoursDiff = createAsyncThunk(
  'workingHoursDiff/postWorkingHoursDiff',
  async (workingHoursDiffData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/working_hours_diffs/`,
        {
          workingHoursDiffData,
        }
      )
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim anlegen des Working Hours Diffs'
      )
    }
  }
)

export const updateWorkingHoursDiffData = createAsyncThunk(
  'workingHoursDiff/updateWorkingHoursDiffData',
  async (workingHoursDiffData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/working_hours_diffs/${workingHoursDiffData.id}`,
        {
          workingHoursDiffData,
        }
      )
      return data.workingHoursDiff
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim anlegen des Working Hours Diffs'
      )
    }
  }
)

export const deleteWorkingHoursDiffData = createAsyncThunk(
  'workingHoursDiff/deleteWorkingHoursDiffData',
  async (working_hours_diff_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/working_hours_diffs/${working_hours_diff_id}`
      )
      return data.deleted_working_hours_diff
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim löschen von des Working Hours Diffs'
      )
    }
  }
)

const workingHoursDiffSlice = createSlice({
  name: 'working_hours_diffs',
  initialState,
  reducers: {
    clearWorkingHoursDiffs: (state) => {
      state.workingHoursDiffsData = []
    },
    fillWorkingHoursDiffs: (state, actions) => {
      state.workingHoursDiffsData = actions
    },
    removeWorkingHoursDiffs: (state, { payload }) => {
      state.workingHoursDiffsData = state.workingHoursDiffsData.find(
        (workingHoursDiff) => workingHoursDiff.id === payload.id
      )
    },
  },
  extraReducers: {
    [getWorkingHoursDiffData.pending]: (state) => {
      state.isLoading = true
    },
    [getWorkingHoursDiffData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.workingHoursDiffsData = payload
    },
    [getWorkingHoursDiffData.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [postWorkingHoursDiff.pending]: (state) => {
      state.isLoading = true
    },
    [postWorkingHoursDiff.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.workingHoursDiffsData.push(payload)
    },
    [postWorkingHoursDiff.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },

    [updateWorkingHoursDiffData.pending]: (state) => {
      state.isLoading = true
    },
    [updateWorkingHoursDiffData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      const workingHoursDiff = state.workingHoursDiffsData.filter(
        (workingHoursDiff) => workingHoursDiff.id !== payload.id
      )
      state.workingHoursDiffsData = { ...workingHoursDiff, payload }
    },
    [updateWorkingHoursDiffData.rejected]: (state, error) => {
      state.errorMessage = error.payload
      state.isLoading = false
      state.hasError = true
    },

    [deleteWorkingHoursDiffData.pending]: (state) => {
      state.isLoading = true
    },
    [deleteWorkingHoursDiffData.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      state.workingHoursDiffsData = state.workingHoursDiffsData.filter(
        (workingHoursDiff) => workingHoursDiff.id !== payload.id
      )
    },
    [deleteWorkingHoursDiffData.rejected]: (state, { payload }) => {
      state.errorMessage = error.payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { clearWorkingHoursDiffs, fillWorkingHoursDiffs } =
  workingHoursDiffSlice.actions

export default workingHoursDiffSlice.reducer
