import React from 'react'
import { useSelector } from 'react-redux'
import './WorkingTimeCell.scss'

function WorkingTime(props) {
  const { dutiesData } = useSelector((store) => store.duties)

  const employeeDuties = dutiesData.filter(
    (duty) => duty.employee_id == props.employeeId
  )

  let workingTime = 0.0

  employeeDuties.map(
    (duty) => (workingTime = workingTime + parseFloat(duty.shift.h_duration))
  )

  console.log(workingTime)

  // console.log("Test: " + props.allDuties);
  return (
    <div className="workingTimeCell">
      <div className="sum">{workingTime.toFixed(2)}</div>
      <div className="diff">123</div>
    </div>
  )
}

export default WorkingTime
