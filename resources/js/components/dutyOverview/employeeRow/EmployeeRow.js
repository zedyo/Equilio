import React from 'react'
import DutyCell from './dutyCell/DutyCell'
import WorkingHoursCell from './workingHoursCell/WorkingHoursCell'
import './EmployeeRow.scss'
import EmployeeCell from './employeeCell/EmployeeCell'

function EmployeeRow(props) {
  return (
    <>
      <div className="employeeRow">
        <EmployeeCell employeeData={props.employeeData} />
        {props.days.map((day) => {
          return (
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
          )
        })}
        <WorkingHoursCell
          employeeData={props.employeeData}
          workingDays={props.workingDays}
          month={props.dateSelectorData.month}
          year={props.dateSelectorData.year}
        />
      </div>
    </>
  )
}

export default EmployeeRow
