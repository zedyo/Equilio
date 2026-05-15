import React, { useEffect, Fragment } from 'react'
import axios from 'axios'
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import '../../../../../../sass/shift_type.scss'
import { useSelector } from 'react-redux'

function ShiftTypeStatistic(props) {
  //TODO: Instant aktualisierung wenn eine Änderung stattfindet in der Duty Übersicht
  //   const { shiftTypesData } = useSelector((store) => store.shiftTypes)

  let shiftTypeDayData = props.shiftTypeDayData

  return (
    <Fragment>
      <div>
        <input
          className="dayStatisticForm"
          disabled
          value={shiftTypeDayData.length}
          style={
            shiftTypeDayData.length < props.shiftTypeObject.min_occupation
              ? { color: 'red' }
              : (shiftTypeDayData.length >=
                  props.shiftTypeObject.min_occupation &&
                  shiftTypeDayData.length <
                    props.shiftTypeObject.opt_occupation) ||
                props.shiftTypeObject.opt_occupation == 0
              ? { color: 'darkgrey' }
              : { color: 'blue' }
          }
        />
      </div>
    </Fragment>
  )
}

export default ShiftTypeStatistic
