import React, { useState, Fragment } from 'react'
import { daysToArray } from '../../../util/daysToArray'
import Day from './day/Day'
import WeekDay from './weekDay/WeekDay'
import moment from 'moment'
import './daysRow.scss'

function Days(props) {
  const days = props.days

  return (
    <Fragment>
      <div className="daysRow">
        {days.map((day) => {
          return (
            <Day
              key={'wd2' + day}
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
              key={'wd' + day}
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
