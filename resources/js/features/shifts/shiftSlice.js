import { createSlice } from '@reduxjs/toolkit'

const initialState = { shiftsData: [], amount: 0, isLoading: true }

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    fillShifts: (state, actions) => {
      state.shiftsData = actions
    },
  },
})

export const { fillShifts } = shiftsSlice.actions

export default shiftsSlice.reducer
