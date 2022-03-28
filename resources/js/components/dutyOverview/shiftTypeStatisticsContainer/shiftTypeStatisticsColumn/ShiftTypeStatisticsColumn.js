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
      <div className="statisticRow">
        <div>
          <p style={shiftTypeName}>{props.shiftTypeName}</p>
        </div>
        {props.days.map((day) => (
          <ShiftTypeStatisticCell
            key={day}
            day={day}
            month={props.dateSelectorData.month}
            year={props.dateSelectorData.year}
            shiftTypeDayData={props.shiftTypeData.filter(
              (duty) => duty.day === day
            )}
          />
        ))}
      </div>
    </Fragment>
  )
}

export default ShiftTypeStatistics
