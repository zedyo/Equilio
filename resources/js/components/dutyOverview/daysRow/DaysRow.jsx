import React, { Fragment } from 'react'
import Day from './day/Day'
import WeekDay from './weekDay/WeekDay'
import './daysRow.scss'

// Gemeinsames Spaltenraster des gesamten Dienstplan-Boards:
// [Label 16rem] [N Tage je 2.2rem] [Saldo 6rem]
function Days(props) {
  const monthlyDays = props.monthlyDays
  const gridTemplateColumns = `16rem repeat(${monthlyDays.length}, 2.2rem) 6rem`

  return (
    <Fragment>
      <div className="daysRow" style={{ gridTemplateColumns }}>
        <div className="rowLabel" />
        {monthlyDays.map((monthlyDay) => (
          <Day
            key={
              'Day: ' +
              props.dateSelectorData.year +
              props.dateSelectorData.month +
              monthlyDay
            }
            day={monthlyDay}
            month={props.dateSelectorData.month}
            year={props.dateSelectorData.year}
          />
        ))}
        <div className="rowTail" />
      </div>

      <div className="daysRow" style={{ gridTemplateColumns }}>
        <div className="rowLabel" />
        {monthlyDays.map((monthlyDay) => (
          <WeekDay
            key={
              'Weekday: ' +
              props.dateSelectorData.year +
              props.dateSelectorData.month +
              monthlyDay
            }
            day={monthlyDay}
            month={props.dateSelectorData.month}
            year={props.dateSelectorData.year}
          />
        ))}
        <div className="rowTail" />
      </div>
    </Fragment>
  )
}

export default Days
