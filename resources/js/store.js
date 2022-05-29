import { configureStore } from '@reduxjs/toolkit'
import employeeSlice from './features/employees/employeeSlice'
import dutySlice from './features/duties/dutySlice'
import shiftsSlice from './features/shifts/shiftSlice'
import qualificationSlice from './features/qualifications/qualificationSlice'
import shiftTypeSlice from './features/shiftTypes/shiftTypeSlice'
import wishSlice from './features/wishes/wishSlice'
import preferenceSlice from './features/preferences/preferenceSlice'
import workingHoursDiffSlice from './features/workingHoursDiffs/workingHoursDiffSlice'

export const store = configureStore({
  reducer: {
    employees: employeeSlice,
    qualifications: qualificationSlice,
    duties: dutySlice,
    shifts: shiftsSlice,
    shiftTypes: shiftTypeSlice,
    wishes: wishSlice,
    preferences: preferenceSlice,
    workingHoursDiffs: workingHoursDiffSlice,
  },
})
