import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = { wishesData: [], isLoading: true }

export const getWishesData = createAsyncThunk(
  'wishes/getWishesData',
  async (wishSlice, thunkAPI) => {
    try {
      const { data } = await axios.get('http://127.0.0.1:8000/api/wishes')
      return data.wishes
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim abholen von Wishes')
    }
  }
)

export const postWishesData = createAsyncThunk(
  'wishes/postWishesData',
  async (wishData, thunkAPI) => {
    try {
      const { data } = await axios.post(`http://127.0.0.1:8000/api/wish/`, {
        wishData,
      })
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim anlegen der Wishes')
    }
  }
)

export const deleteWishesData = createAsyncThunk(
  'wishes/deleteWishesData',
  async (wish_id, thunkAPI) => {
    try {
      const { data } = await axios.delete(
        `http://127.0.0.1:8000/api/wishes/${wish_id}`
      )
      return data.deleted_wish
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim löschen von des Wishes')
    }
  }
)

export const getWishesByEmployee = createAsyncThunk(
  'wishes/getWishesByEmployee',
  async (employeeId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/wishesByEmployee/${employeeId}`
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue('Fehler beim Abholen der eigenen Wünsche')
    }
  }
)

const wishSlice = createSlice({
  name: 'wishes',
  initialState,
  reducers: {
    fillWishes: (state, actions) => {
      state.wishesData = actions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishesData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getWishesData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.wishesData = payload
      })
      .addCase(getWishesData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(getWishesByEmployee.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.wishesData = payload
      })
      .addCase(postWishesData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(postWishesData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.wishesData.push(payload)
      })
      .addCase(postWishesData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
      .addCase(deleteWishesData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteWishesData.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.wishesData = state.wishesData.filter(
          (wish) => wish.id !== payload.id
        )
      })
      .addCase(deleteWishesData.rejected, (state, { payload }) => {
        state.errorMessage = payload
        state.isLoading = false
        state.hasError = true
      })
  },
})

export const { fillWishes } = wishSlice.actions

export default wishSlice.reducer
