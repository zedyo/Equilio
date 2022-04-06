import React, { useState } from 'react'
import './DutyCell.scss'

function InputDuty(props) {
  const allDuties = props.allDuties
  if (allDuties) {
    const dutie = allDuties.find(
      (d) => d.day === props.day && d.employee_id === props.employee_id
    )

    let dutyVal = dutie ? dutie.shift.abrv : ''

    let dutyColor = dutie ? dutie.shift.color_hex : 'black'

    const [InputDuty, setInputDuty] = useState(dutyVal)
    const [DutyColor, setDutyColor] = useState(dutyColor)
    const [CellStyle, setCellStyle] = useState('inputDutyForm')

    // let color = dutie ? dutie.shift.color_hex : DutyColor;
    let color = DutyColor

    // TODO: Einbauen Fehler wenn Duty nicht vorhanden ist.
    // TODO: Einbauen Farbe verändert sich nicht wenn Überschrieben wird

    // TODO: WEnn per Tab ein eingetragenes Feld verlassen wird, wird das Feld geleert (zumindest sichtbar)

    const inputColor = {
      color: color,
    }

    async function sendDuty(value, day, month, year, employee_id) {
      if (value !== '') {
        try {
          const { data } = await axios.patch(
            `http://127.0.0.1:8000/api/duty/`,
            {
              value,
              day,
              month,
              year,
              employee_id,
            }
          )

          const hex = data.new_duty.shift.color_hex

          // console.log(data.new_duty.shift.color_hex, "undefined");

          if (data.length !== 0 || hex) {
            // console.log("UPDATE DONE!");
            setDutyColor(data.new_duty.shift.color_hex)
            setCellStyle('inputDutyForm')
          }
        } catch (error) {
          //TODO: Nur bei richtigem Statuscode 404 ausführen nicht nur bei error
          // console.loge(data.exception);
          setCellStyle('error')
          setInputDuty('')
        }
      }
    }

    return (
      <input
        style={inputColor}
        className={CellStyle}
        value={InputDuty}
        onChange={(e) => setInputDuty(e.target.value)}
        onBlur={(e) =>
          sendDuty(
            InputDuty,
            props.day,
            props.month,
            props.year,
            props.employee_id
          )
        }
      />
    )
  }

  return <p>Loading...</p>
}

export default InputDuty
