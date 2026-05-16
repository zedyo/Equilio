import React from 'react'
import './EmployeeCell.scss'
import { useDispatch } from 'react-redux'
import WishCreator from './wishCreator/WishCreator'
import { getWishesData } from '../../../../features/wishes/wishSlice'

function EmployeeCell({ employeeData, dateSelectorData }) {
  const dispatch = useDispatch()
  const fullName = `${employeeData.first_name} ${employeeData.last_name}`

  return (
    <div className="employeeContainer">
      <a
        href={`/employee/show/${employeeData.id}`}
        className="employeeName"
        title={`Profil von ${fullName}`}
      >
        {fullName}
      </a>
      <div className="employeeCell__action">
        <WishCreator
          employeeId={employeeData.id}
          employeeName={fullName}
          defaultDate={
            dateSelectorData && {
              month: Number(dateSelectorData.month),
              year: Number(dateSelectorData.year),
            }
          }
          onSaved={() => dispatch(getWishesData())}
          iconOnly
          variant="outline-primary"
        />
      </div>
    </div>
  )
}

export default EmployeeCell
