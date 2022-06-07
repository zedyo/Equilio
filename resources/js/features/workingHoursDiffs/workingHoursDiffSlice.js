import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { workingHoursDiffsData: [], isLoading: true }

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
      return data.new_working_hours_diff
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim anlegen des Working Hours Diffs'
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
    [postWorkingHoursDiff.pending]: (state) => {
      state.isLoading = true
    },
    [postWorkingHoursDiff.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      const workingHoursDiff = state.workingHoursDiffsData.filter(
        (workingHoursDiff) => workingHoursDiff.id !== payload.id
      )
      state.workingHoursDiffsData = [...workingHoursDiff, payload]
    },
    [postWorkingHoursDiff.rejected]: (state, { payload }) => {
      state.errorMessage = payload
      state.isLoading = false
      state.hasError = true
    },
  },
})

export const { clearWorkingHoursDiffs, fillWorkingHoursDiffs } =
  workingHoursDiffSlice.actions

export default workingHoursDiffSlice.reducer
