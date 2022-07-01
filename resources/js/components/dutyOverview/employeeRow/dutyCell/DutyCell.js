import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { deleteDuty, postDuty } from '../../../../features/duties/dutySlice'
import style from './DutyCell.scss'

function DutyCell(props) {
  let employeeDuty = props.employeeDuty
  const dispatch = useDispatch()

  let wish = props.employeeWish.find(
    (d) => d.day == props.day && d.month == props.month
  )

  //TODO: Etwas helleres grau eines Wunsches
  //TODO: Error Handling bei Inputeingabe

  if (employeeDuty) {
    const duty = employeeDuty.find((d) => d.day === props.day)

    let [inputDutyValue, setInputDuty] = useState('')

    useEffect(() => {
      duty !== undefined ? setInputDuty(duty.shift.abrv) : setInputDuty('')
    }, [employeeDuty])

    const [DutyColor, setDutyColor] = useState('black')

    useEffect(() => {
      duty !== undefined
        ? setDutyColor(duty.shift.color_hex)
        : setDutyColor('black')
    }, [employeeDuty])

    const [CellStyle, setCellStyle] = useState('inputDutyForm')

    let color = DutyColor

    const inputColor = {
      color: color,
    }

    return (
      <input
        style={
          moment(`${props.year}-${props.month}-${props.day}`).format('dd') ==
            'So' ||
          moment(`${props.year}-${props.month}-${props.day}`).format('dd') ==
            'Sa'
            ? {
                color: color,
                borderColor: 'darkgrey',
              }
            : {
                color: color,
              }
        }
        className={
          duty === undefined
            ? 'inputDutyForm'
            : duty.shift.shift_type.active_duty == 0 ||
              duty.shift.shift_type.active_duty == undefined
            ? 'passiveDuty'
            : duty.wish_injury == true
            ? 'wishInjury'
            : duty.preference_injury == true && wish == undefined
            ? 'preferenceInjury'
            : wish !== undefined
            ? 'wishForm'
            : 'inputDutyForm'
        }
        value={inputDutyValue}
        placeholder={wish !== undefined ? wish.shift.abrv : ''}
        onChange={(e) => setInputDuty(e.target.value)}
        onBlur={() =>
          inputDutyValue == ''
            ? dispatch(
                deleteDuty({
                  day: props.day,
                  month: props.month,
                  year: props.year,
                  employee_id: props.employeeId,
                })
              )
            : dispatch(
                postDuty({
                  value: inputDutyValue,
                  day: props.day,
                  month: props.month,
                  year: props.year,
                  employee_id: props.employeeId,
                })
              )
        }
      />
    )
  }

  return <p>Loading...</p>
}

export default DutyCell
