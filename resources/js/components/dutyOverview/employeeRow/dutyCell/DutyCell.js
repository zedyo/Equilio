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

  //TODO: CSS Hervorhebung, falls Wish und Duty nicht übereinstimmen
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

    // async function sendDuty(value, day, month, year, employee_id) {
    //   if (value !== '') {
    //     try {
    //       const { data } = await axios.patch(
    //         `http://127.0.0.1:8000/api/duty/`,
    //         {
    //           value,
    //           day,
    //           month,
    //           year,
    //           employee_id,
    //         }
    //       )

    //       const hex = data.new_duty.shift.color_hex

    //       if (data.length !== 0 || hex) {
    //         setDutyColor(data.new_duty.shift.color_hex)
    //         setCellStyle('inputDutyForm')
    //       }
    //     } catch (error) {
    //       setCellStyle('error')
    //       setInputDuty('')
    //     }
    //   }
    // }

    return (
      <input
        style={inputColor}
        className={
          duty === undefined
            ? CellStyle
            : duty.wish_injury == true
            ? 'wishInjury'
            : duty.preference_injury == true
            ? 'preferenceInjury'
            : wish !== undefined
            ? 'wishForm'
            : CellStyle
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
        // onBlur={(e) =>
        //   sendDuty(
        //     inputDutyValue,
        //     props.day,
        //     props.month,
        //     props.year,
        //     props.employeeId
        //   )
        // }
      />
    )
  }

  return <p>Loading...</p>
}

export default DutyCell
