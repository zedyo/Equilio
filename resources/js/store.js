import { configureStore } from '@reduxjs/toolkit'
import employeeSlice from './features/employees/employeeSlice'
import dutySlice from './features/duties/dutySlice'
import shiftsSlice from './features/shifts/shiftSlice'
import qualificationSlice from './features/qualifications/qualificationSlice'

export const store = configureStore({
  reducer: {
    employees: employeeSlice,
    qualifications: qualificationSlice,
    duties: dutySlice,
    shifts: shiftsSlice,
  },
})
