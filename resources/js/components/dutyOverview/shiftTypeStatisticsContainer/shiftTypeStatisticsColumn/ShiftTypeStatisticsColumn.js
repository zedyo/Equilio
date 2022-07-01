import React, { Fragment } from 'react'
import ShiftTypeStatisticCell from './shiftTypeStatisticCell/ShiftTypeStatisticCell'
import '../../../../../sass/shift_type.scss'
import style from './ShiftTypeStatisticsColumn.scss'

function ShiftTypeStatistics(props) {
  return (
    <Fragment>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateColumns: `auto ${props.days.length * 2.2}rem 6rem`,
          alignItems: 'center',
          height: '1.6rem',
        }}
      >
        <div className={'shiftTypeNameContainer'}>
          <p className={'shiftTypeName'}>{props.shiftTypeName}</p>
        </div>
        <div className={'sumCells'}>
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
