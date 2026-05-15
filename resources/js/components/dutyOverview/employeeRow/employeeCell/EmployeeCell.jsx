import React, { useState } from 'react'
import './EmployeeCell.scss'
import { Popover, OverlayTrigger, Button } from 'react-bootstrap'
import { AiOutlinePlus } from 'react-icons/ai'
import WishCreator from './wishCreator/WishCreator'
import { Link } from 'react-router-dom'

function EmployeeCell(props) {
  const [isShown, setIsShown] = useState(false)

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
      <div
        className="employeeContainer"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <div>
          {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}> */}
          <a
            href={`/employee/show/${props.employeeData.id}`}
            className="employeeName"
          >
            {props.employeeData.first_name} {props.employeeData.last_name}
          </a>

          {/* </OverlayTrigger> */}
        </div>
        {isShown && (
          <WishCreator isShown={isShown} employeeId={props.employeeData.id} />

          // <Button variant="outline-info" size="sm" className="wishButton">
          //   <AiOutlinePlus />
          //   Wunsch
          // </Button>
        )}
      </div>
    </>
  )
}

export default EmployeeCell
