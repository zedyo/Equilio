import React from 'react'
import DutyCell from './dutyCell/DutyCell'
import WorkingTimeCell from './workingTimeCell/WorkingTimeCell'
import './EmployeeRow.scss'
import EmployeeCell from './employeeCell/EmployeeCell'

function EmployeeRow(props) {
  return (
    <>
      <div className="employeeRow">
        <EmployeeCell employeeData={props.employeeData} />
        {props.days.map((day) => (
          <DutyCell
            key={
              'DutyCell:' +
              props.employeeData.id +
              props.dateSelectorData.year +
              props.dateSelectorData.month +
              day
            }
            day={day}
            month={props.dateSelectorData.month}
            year={props.dateSelectorData.year}
            employeeDuty={props.employeeDuties.filter((d) => d.day === day)}
            employeeWish={props.employeeWishes.filter((d) => d.day === day)}
            employeeId={props.employeeData.id}
          />
        ))}
        <WorkingTimeCell allDuties={props.employeeDuties} />
      </div>
    </>
  )
}

export default EmployeeRow
