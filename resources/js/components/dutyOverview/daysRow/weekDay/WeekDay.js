import React from 'react'
import moment from 'moment'
import './weekDay.scss'
import { holidays } from '../utils/holidays'

function WeekDay(props) {
  let day = Intl.NumberFormat('de', { minimumIntegerDigits: 2 }).format(
    props.day
  )

  let month = Intl.NumberFormat('de', { minimumIntegerDigits: 2 }).format(
    props.month
  )

  return (
    <div
      className={
        holidays.find(
          (holiday) =>
            holiday.date ===
            moment(`${props.year}-${month}-${day}`).format('YYYY-MM-DD')
        )?.holiday.length > 0
          ? 'holidayWeekday'
          : moment(`${props.year}-${month}-${day}`).format('dd') == 'So' ||
            moment(`${props.year}-${month}-${day}`).format('dd') == 'Sa'
          ? 'weekendWeekday'
          : 'weekday'
      }
    >
      {moment(`${props.year}-${month}-${day}`).format('dd')}
    </div>
  )
}

export default WeekDay
