import React, { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ShiftTypeStatisticsColumn from './shiftTypeStatisticsColumn/ShiftTypeStatisticsColumn'

function ShiftTypeStatisticsContainer(props) {
  const [shiftTypeData, setShiftType] = useState([])
  const { dutiesData } = useSelector((store) => store.duties)
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)

  return (
    <Fragment>
      {shiftTypesData
        .filter((shiftType) => shiftType.active_duty == true)
        .map((shiftTypeObject) => (
          <ShiftTypeStatisticsColumn
            days={props.days}
            dateSelectorData={props.dateSelectorData}
            key={'ShiftTypeStatisticsColumn:' + shiftTypeObject.id}
            shiftTypeName={shiftTypeObject.name}
            shiftTypeObject={shiftTypeObject}
            shiftTypeData={dutiesData.filter(
              (duty) =>
                duty.shift.shift_type !== undefined &&
                duty.shift.shift_type.id === shiftTypeObject.id
            )}
          />
        ))}
    </Fragment>
  )
}

export default ShiftTypeStatisticsContainer
