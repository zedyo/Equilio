import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteEmployeeData } from '../../../features/employees/employeeSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'

function Employee(props) {
  const dispatch = useDispatch()
  return (
    <Fragment>
      <tr>
        <td>{props.employeeData.id}</td>
        <td>{props.employeeData.first_name}</td>
        <td>{props.employeeData.last_name}</td>
        <td>{props.employeeData.qualification.description}</td>
        <td>{props.employeeData.employment_ratio} %</td>
        <td>{props.employeeData.daily_worktime}</td>
        <td>
          <Button
            href={`/employee/show/${props.employeeData.id}`}
            variant="outline-secondary"
            size="sm"
          >
            <FaRegEdit />
          </Button>{' '}
          {/* <Button
            href={`/employee/edit/${props.employeeData.id}`}
            variant="outline-secondary"
            size="sm"
          >
            Bearbeiten
          </Button>{' '} */}
          <Button
            onClick={() => dispatch(deleteEmployeeData(props.employeeData.id))}
            variant="outline-danger"
            size="sm"
          >
            <FaRegTrashAlt />
          </Button>{' '}
        </td>
      </tr>
    </Fragment>
  )
}

export default Employee
