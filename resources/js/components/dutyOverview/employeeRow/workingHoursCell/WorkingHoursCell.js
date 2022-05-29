import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postWorkingHoursDiff } from '../../../../features/workingHoursDiffs/workingHoursDiffSlice'

import './WorkingHoursCell.scss'

function WorkingHoursCell(props) {
  const dispatch = useDispatch()

  const { dutiesData } = useSelector((store) => store.duties)

  const employeeDuties = dutiesData.filter(
    (duty) => duty.employee_id == props.employeeData.id
  )

  let dutyWorkingHours = 0.0

  employeeDuties.map(
    (duty) =>
      (dutyWorkingHours = dutyWorkingHours + parseFloat(duty.shift.h_duration))
  )

  let maxMonthlyWorkingHours = parseFloat(
    ((props.workingDays.length * props.employeeData.daily_worktime) / 100) *
      props.employeeData.employment_ratio
  )
  let workingHoursDiff = dutyWorkingHours - maxMonthlyWorkingHours

  useEffect(() => {
    dispatch(
      postWorkingHoursDiff({
        employee_id: props.employeeData.id,
        month: props.month,
        year: props.year,
        diff: workingHoursDiff,
      })
    )
  }, [dutyWorkingHours])

  return (
    <div className="workingHoursCell">
      <div className="sum">{dutyWorkingHours.toFixed(2)}</div>
      <div className="workingHoursDiff">{workingHoursDiff.toFixed(2)}</div>
    </div>
  )
}

export default WorkingHoursCell
