import React from 'react'
import './EmployeeCell.scss'

function EmployeeCell(props) {
  return (
    <>
      <div className="employeeContainer">
        <div>
          <p className="employeeName">
            {props.employeeData.first_name} {props.employeeData.last_name}
          </p>
          <p className="employeeQualification">
            {props.employeeData.qualification.description}
          </p>
        </div>
      </div>
    </>
  )
}

export default EmployeeCell
