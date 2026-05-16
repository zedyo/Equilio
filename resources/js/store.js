import { configureStore } from '@reduxjs/toolkit'
import employeeSlice from './features/employees/employeeSlice'
import dutySlice from './features/duties/dutySlice'
import shiftsSlice from './features/shifts/shiftSlice'
import qualificationSlice from './features/qualifications/qualificationSlice'
import shiftTypeSlice from './features/shiftTypes/shiftTypeSlice'
import wishSlice from './features/wishes/wishSlice'
import preferenceSlice from './features/preferences/preferenceSlice'
import workingHoursDiffSlice from './features/workingHoursDiffs/workingHoursDiffSlice'
import absenceSlice from './features/absences/absenceSlice'
import authSlice from './features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    absences: absenceSlice,
    qualifications: qualificationSlice,
    duties: dutySlice,
    shifts: shiftsSlice,
    shiftTypes: shiftTypeSlice,
    wishes: wishSlice,
    preferences: preferenceSlice,
    workingHoursDiffs: workingHoursDiffSlice,
  },
})
