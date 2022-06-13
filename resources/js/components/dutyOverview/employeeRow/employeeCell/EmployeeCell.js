import React from 'react'
import './EmployeeCell.scss'
import { Popover, OverlayTrigger, Button } from 'react-bootstrap'
import { AiOutlinePlus } from 'react-icons/ai'

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
        </div>
        <Button variant="outline-info" size="sm">
          <AiOutlinePlus />
          Wunsch
        </Button>
      </div>
    </>
  )
}

export default EmployeeCell
