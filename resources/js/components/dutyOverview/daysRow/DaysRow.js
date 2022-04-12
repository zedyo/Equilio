import React, { Fragment } from 'react'
import Day from './day/Day'
import WeekDay from './weekDay/WeekDay'
import './daysRow.scss'

function Days(props) {
  const monthlyDays = props.monthlyDays

  return (
    <Fragment>
      <div className="daysRow">
        {monthlyDays.map((monthlyDay) => {
          return (
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
          )
        })}
      </div>

      <div className="daysRow">
        {monthlyDays.map((monthlyDay) => {
          return (
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
          )
        })}
      </div>
    </Fragment>
  )
}

export default Days
