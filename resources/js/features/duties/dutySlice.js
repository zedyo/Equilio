import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { dutiesData: [], isLoading: true }

export const getDutiesData = createAsyncThunk(
  'duties/getDutiesData',
  async (duty, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/duties')
      return data.duties
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von duties')
    }
  }
)

export const getDutiesDataByMonth = createAsyncThunk(
  'duties/getDutiesDataByMonth',
  async (date, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/duties/${date.year}/${date.month}`
      )
      return data.duties
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von duties')
    }
  }
)

export const postDuty = createAsyncThunk(
  'duties/postDuty',
  async (dutyData, thunkAPI) => {
    try {
      const { data } = await axios.patch(`http://127.0.0.1:8000/api/duty/`, {
        dutyData,
      })
      return data != null && data.new_duty
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von duties')
    }
  }
)

export const deleteDuty = createAsyncThunk(
  'duties/deleteDuty',
  async (dutyData, thunkAPI) => {
    try {
      const { data } = await axios.post(`http://127.0.0.1:8000/api/duty/`, {
        dutyData,
      })
      return data.deleted_duty
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von der duty')
    }
  }
)

export const postDutiesData = createAsyncThunk(
  'duties/postDutiesData',
  async (dutiesData, thunkAPI) => {
    try {
      const { data } = await axios.post(`http://127.0.0.1:8000/api/duties/`, {
        dutiesData,
      })
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der duty')
    }
  }
)

export const updateDutiesData = createAsyncThunk(
  'duties/updateDutiesData',
  async (dutyData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/duties/${dutyData.id}`,
        {
          dutyData,
        }
      )
      return data.duty
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim updaten der duty')
    }
  }
)

export const deleteDutiesData = createAsyncThunk(
  'duties/deleteDutiesData',
  async (duty_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/duties/${duty_id}`
      )
      return data.deleted_duty
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von der duty')
    }
  }
)

const dutySlice = createSlice({
  name: 'duties',
  initialState,
  reducers: {
    clearDuties: (state) => {
      state.dutiesData = []
    },
    fillDuties: (state, actions) => {
      state.dutiesData = actions
    },
    removeDuties: (state, { payload }) => {
      state.dutiesData = state.dutiesData.find((duty) => duty.id === payload.id)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDutiesDataByMonth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDutiesDataByMonth.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.dutiesData = payload
      })
      .addCase(getDutiesDataByMonth.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(postDuty.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postDuty.fulfilled, (state, { payload }) => {
        state.isLoading = false
        const duty = state.dutiesData.filter((duty) => duty.id !== payload.id)
        state.dutiesData = [...duty, payload]
      })
      .addCase(postDuty.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(deleteDuty.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDuty.fulfilled, (state, { payload }) => {
        state.isLoading = false
        if (payload != null) {
          state.dutiesData = state.dutiesData.filter(
            (duty) => duty.id != payload.id
          )
        }
      })
      .addCase(deleteDuty.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(deleteDutiesData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDutiesData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.dutiesData = state.dutiesData.filter(
          (duty) => duty.id !== payload.id
        )
      })
      .addCase(deleteDutiesData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
  },
})

export const { clearDuties, fillDuties } = dutySlice.actions

export default dutySlice.reducer
