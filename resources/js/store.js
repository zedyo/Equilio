import { configureStore } from '@reduxjs/toolkit'
import employeeSlice from './features/employees/employeeSlice'
import dutySlice from './features/duties/dutySlice'
import shiftsSlice from './features/shifts/shiftSlice'

export const store = configureStore({
  reducer: {
    employees: employeeSlice,
    duties: dutySlice,
    shifts: shiftsSlice,
  },
})
