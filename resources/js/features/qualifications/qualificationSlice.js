import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { qualificationsData: [], isLoading: true }

export const getQualificationsData = createAsyncThunk(
  'qualifications/getQualificationsData',
  async (qualification, thunkAPI) => {
    try {
      const { data } = await axios.get(
        'http://127.0.0.1:8000/api/qualifications'
      )
      return data.qualifications
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Qualifications')
    }
  }
)

export const postQualificationsData = createAsyncThunk(
  'qualifications/postQualificationsData',
  async (qualificationsData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `http://127.0.0.1:8000/api/qualifications/`,
        {
          qualificationsData,
        }
      )
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der Qualification')
    }
  }
)

export const updateQualificationsData = createAsyncThunk(
  'qualifications/updateQualificationsData',
  async (qualificationData, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `http://127.0.0.1:8000/api/qualifications/${qualificationData.id}`,
        {
          qualificationData,
        }
      )
      return data.qualification
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim updaten der Qualification')
    }
  }
)

export const deleteQualificationsData = createAsyncThunk(
  'qualifications/deleteQualificationsData',
  async (qualification_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/qualifications/${qualification_id}`
      )
      return data.deleted_qualification
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Fehler beim löschen von der Qualification'
      )
    }
  }
)

const qualificationSlice = createSlice({
  name: 'qualifications',
  initialState,
  reducers: {
    clearQualifcations: (state) => {
      state.qualificationsData = []
    },
    fillQualifications: (state, actions) => {
      state.qualificationsData = actions
    },
    removeQualifications: (state, { payload }) => {
      state.qualificationsData = state.qualificationsData.find(
        (qualification) => qualification.id === payload.id
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQualificationsData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getQualificationsData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.qualificationsData = payload
      })
      .addCase(getQualificationsData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(postQualificationsData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postQualificationsData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.qualificationsData.push(payload)
      })
      .addCase(postQualificationsData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(updateQualificationsData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateQualificationsData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        const qualification = state.qualificationsData.filter(
          (qualification) => qualification.id !== payload.id
        )
        state.qualificationData = { ...qualification, payload }
      })
      .addCase(updateQualificationsData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(deleteQualificationsData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteQualificationsData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.qualificationsData = state.qualificationsData.filter(
          (qualification) => qualification.id !== payload.id
        )
      })
      .addCase(deleteQualificationsData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
  },
})

export const { clearQualifcations, fillQualifications } =
  qualificationSlice.actions

export default qualificationSlice.reducer
