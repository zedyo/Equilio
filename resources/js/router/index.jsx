import { useEffect } from 'react'
import {
  Routes,
  BrowserRouter,
  HashRouter,
  Route,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import NavigationBar from '../components/NavigationBar'
import QualificationOverview from '../components/qualifications/QualificationOverview'
import UpdateQualification from '../components/qualifications/update/UpdateQualification'
import CreateQualification from '../components/qualifications/create/CreateQualification'
import EmployeesOverview from '../components/employees/EmployeesOverview'
import DutyOverview from '../components/dutyOverview/DutyOverview'
import UpdateEmployee from '../components/employees/update/UpdateEmployee'
import CreateEmployee from '../components/employees/create/CreateEmployee'
import ShiftOverview from '../components/shifts/ShiftOverview'
import ShiftTypeOverview from '../components/shiftTypes/ShiftTypeOverview'
import UpdateShift from '../components/shifts/update/UpdateShift'
import CreateShift from '../components/shifts/create/CreateShift'
import UpdateShiftType from '../components/shiftTypes/update/UpdateShiftType'
import CreateShiftType from '../components/shiftTypes/create/CreateShiftType'
import WishCreator from '../components/dutyOverview/employeeRow/employeeCell/wishCreator/WishCreator'
import EmployeeDetails from '../components/employees/show/employeeOverview/EmployeeDetails'
import { getEmployeeData } from '../features/employees/employeeSlice'
import { getQualificationsData } from '../features/qualifications/qualificationSlice'
import { getShiftsData } from '../features/shifts/shiftSlice'
import { getShiftTypesData } from '../features/shiftTypes/shiftTypeSlice'
import { getDutiesData } from '../features/duties/dutySlice'
import { getWishesData } from '../features/wishes/wishSlice'
import { getPreferenceData } from '../features/preferences/preferenceSlice'

const AppRouter =
  typeof window !== 'undefined' && window.__YETI_DEMO__
    ? HashRouter
    : BrowserRouter

function Router() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getEmployeeData())
    dispatch(getQualificationsData())
    dispatch(getShiftsData())
    dispatch(getShiftTypesData())
    dispatch(getDutiesData())
    dispatch(getWishesData())
    dispatch(getPreferenceData())
  }, [dispatch])

  return (
    <AppRouter>
      <NavigationBar />
      <Routes>
        <Route path="/qualification/edit/:id" element={<UpdateQualification />} />
        <Route path="/qualification/create" element={<CreateQualification />} />
        <Route path="/qualifications" element={<QualificationOverview />} />
        <Route path="/shift/edit/:id" element={<UpdateShift />} />
        <Route path="/shift/create" element={<CreateShift />} />
        <Route path="/shifts" element={<ShiftOverview />} />
        <Route path="/shift_type/edit/:id" element={<UpdateShiftType />} />
        <Route path="/shift_type/create" element={<CreateShiftType />} />
        <Route path="/shift_types" element={<ShiftTypeOverview />} />
        <Route path="/employee/edit/:id" element={<UpdateEmployee />} />
        <Route path="/employee/show/:id" element={<EmployeeDetails />} />
        <Route path="/employee/create" element={<CreateEmployee />} />
        <Route path="/employees" element={<EmployeesOverview />} />
        <Route path="/duties" element={<DutyOverview />} />
        <Route path="/wish_creator" element={<WishCreator />} />
        <Route path="/" element={<DutyOverview />} />
      </Routes>
    </AppRouter>
  )
}

export default Router
