import React, { Fragment } from 'react'
import Day from './day/Day'
import WeekDay from './weekDay/WeekDay'
import './daysRow.scss'

function Days(props) {
  const days = props.days

  return (
    <Fragment>
      <div className="daysRow">
        {days.map((day) => {
          return (
            <Day
              key={
                'Day: ' +
                props.dateSelectorData.year +
                props.dateSelectorData.month +
                day
              }
              day={day}
              month={props.dateSelectorData.month}
              year={props.dateSelectorData.year}
            />
          )
        })}
      </div>

      <div className="daysRow">
        {days.map((day) => {
          return (
            <WeekDay
              key={
                'Weekday: ' +
                props.dateSelectorData.year +
                props.dateSelectorData.month +
                day
              }
              day={day}
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
