import { createSlice } from '@reduxjs/toolkit'

const initialState = { employeesData: [], amount: 0, isLoading: true }

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // bsp clearEmployees:
    // state beinhaltet den aktuellen state dieses Slices
    clearEmployees: (state) => {
      state.employeesData = []
    },
    fillEmployees: (state, actions) => {
      state.employeesData = actions
    },
  },
})

export const { clearEmployees, fillEmployees } = employeesSlice.actions

export default employeesSlice.reducer
