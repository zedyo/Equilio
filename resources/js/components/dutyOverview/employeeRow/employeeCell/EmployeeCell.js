import React from 'react'
import './EmployeeCell.scss'
import { Popover, OverlayTrigger } from 'react-bootstrap'

function EmployeeCell(props) {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">
        {props.employeeData.first_name} {props.employeeData.last_name}
      </Popover.Header>
      <Popover.Body>
        <div>Neuer Wunsch</div>
        <div>Mitarbeiterdetails</div>
      </Popover.Body>
    </Popover>
  )

  return (
    <>
      <div className="employeeContainer">
        <div>
          {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}> */}
          <div className="employeeName">
            {props.employeeData.first_name} {props.employeeData.last_name}
          </div>
          {/* </OverlayTrigger> */}
          <div className="employeeQualification">
            {props.employeeData.qualification.description}
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployeeCell
