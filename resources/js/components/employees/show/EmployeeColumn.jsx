import React, { Fragment, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteEmployeeData } from '../../../features/employees/employeeSlice'
import { FaRegTrashAlt, FaRegEdit, FaRegUser } from 'react-icons/fa'
import ConfirmDialog from '../../shared/ConfirmDialog'

function Employee(props) {
  const dispatch = useDispatch()
  const [confirm, setConfirm] = useState(false)
  const e = props.employeeData
  const fullName = `${e.first_name} ${e.last_name}`

  return (
    <Fragment>
      <tr>
        <td>{e.id}</td>
        <td>{e.first_name}</td>
        <td>{e.last_name}</td>
        <td>{e.qualification.description}</td>
        <td>{e.employment_ratio} %</td>
        <td>{e.daily_worktime}</td>
        <td className="text-end">
          <div className="d-inline-flex gap-2">
            <Button
              href={`/employee/show/${e.id}`}
              variant="outline-secondary"
              size="sm"
            >
              <FaRegUser /> Profil
            </Button>
            <Button
              href={`/employee/edit/${e.id}`}
              variant="outline-primary"
              size="sm"
            >
              <FaRegEdit /> Bearbeiten
            </Button>
            <Button
              onClick={() => setConfirm(true)}
              variant="outline-danger"
              size="sm"
              aria-label={`${fullName} löschen`}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        show={confirm}
        title="Teammitglied löschen?"
        body={
          <>
            <strong>{fullName}</strong> wird aus dem Team entfernt.
          </>
        }
        onConfirm={() => {
          dispatch(deleteEmployeeData(e.id))
          setConfirm(false)
        }}
        onCancel={() => setConfirm(false)}
      />
    </Fragment>
  )
}

export default Employee
