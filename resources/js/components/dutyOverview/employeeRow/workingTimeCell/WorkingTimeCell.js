import React from 'react'
import { useSelector } from 'react-redux'
import './WorkingTimeCell.scss'
import { holidays } from '../../daysRow/utils/holidays'

function WorkingTime(props) {
  const { dutiesData } = useSelector((store) => store.duties)

  const employeeDuties = dutiesData.filter(
    (duty) => duty.employee_id == props.employeeData.id
  )

  let workingTime = 0.0

  employeeDuties.map(
    (duty) => (workingTime = workingTime + parseFloat(duty.shift.h_duration))
  )

  let workingHours = parseFloat(
    ((props.workingDays.length * props.employeeData.daily_worktime) / 100) *
      props.employeeData.employment_ratio
  )
  let diff = workingTime - workingHours

  return (
    <div className="workingTimeCell">
      <div className="sum">{workingTime.toFixed(2)}</div>
      <div className="diff">{diff.toFixed(2)}</div>
    </div>
  )
}

export default WorkingTime
