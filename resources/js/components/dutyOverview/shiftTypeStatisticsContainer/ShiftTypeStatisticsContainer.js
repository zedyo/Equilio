import React, { Fragment, useState, useEffect } from 'react'
import ShiftTypeStatisticsColumn from './shiftTypeStatisticsColumn/ShiftTypeStatisticsColumn'

function ShiftTypesOverview(props) {
  const [shiftTypeData, setShiftType] = useState([])

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get(
        'http://127.0.0.1:8000/api/shift_types',
        {}
      )
      setShiftType(data.shift_types)
    }
    getData()
  }, [])

  return (
    <Fragment>
      {shiftTypeData.map((shiftTypeObject) => (
        <ShiftTypeStatisticsColumn
          days={props.days}
          dateSelectorData={props.dateSelectorData}
          key={shiftTypeObject.id}
          shiftTypeName={shiftTypeObject.name}
          shiftTypeData={props.allDuties.filter(
            (duty) => duty.shift.shift_type.id === shiftTypeObject.id
          )}
        />
      ))}
    </Fragment>
  )
}

export default ShiftTypesOverview
