import React, { Fragment } from 'react'
import ShiftTypeStatisticCell from './shiftTypeStatisticCell/ShiftTypeStatisticCell'
import '../../../../../sass/shift_type.scss'

function ShiftTypeStatistics(props) {
  const shiftTypeName = {
    color: 'grey',
  }

  // --- Abholen aus der Datenbank unnütz ---
  // async function loadData() {
  //     const data = await axios.get(
  //         `http://127.0.0.1:8000/api/shift_types/1/${props.day}/${props.month}/${props.year}/`,
  //         {}
  //     );
  //     console.log(data);
  // }
  // loadData();

  return (
    <Fragment>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateColumns: `auto ${props.days.length * 2.2}rem 6rem`,
          alignItems: 'center',
        }}
      >
        <div>
          <p style={shiftTypeName}>{props.shiftTypeName}</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            // gridTemplateColumns: `auto ${props.days.length * 2.2}rem 6rem`,
            alignItems: 'center',
          }}
        >
          {props.days.map((day) => (
            <div style={{ justifySelf: 'center' }}>
              <ShiftTypeStatisticCell
                key={
                  'statisticCell:' +
                  day +
                  props.dateSelectorData.month +
                  props.dateSelectorData.year +
                  props.shiftTypeName
                }
                day={day}
                month={props.dateSelectorData.month}
                year={props.dateSelectorData.year}
                shiftTypeDayData={props.shiftTypeData.filter(
                  (duty) => duty.day === day
                )}
                shiftTypeObject={props.shiftTypeObject}
                desabled
              />
            </div>
          ))}
        </div>

        <div></div>
      </div>
    </Fragment>
  )
}

export default ShiftTypeStatistics
