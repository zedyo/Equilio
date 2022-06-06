import { data } from 'jquery'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postWorkingHoursDiff } from '../../../../features/workingHoursDiffs/workingHoursDiffSlice'
import moment from 'moment'

import './WorkingHoursCell.scss'

function WorkingHoursCell(props) {
  const dispatch = useDispatch()

  const { dutiesData } = useSelector((store) => store.duties)
  const { workingHoursDiffsData } = useSelector(
    (store) => store.workingHoursDiffs
  )

  const employeeDuties = dutiesData.filter(
    (duty) => duty.employee_id == props.employeeData.id
  )

  let dutyWorkingHours = 0.0

  employeeDuties.map(
    (duty) =>
      (dutyWorkingHours = dutyWorkingHours + parseFloat(duty.shift.h_duration))
  )

  let maxMonthlyWorkingHours = parseFloat(
    ((props.workingDays.length * props.employeeData.daily_worktime) / 100) *
      props.employeeData.employment_ratio
  )

  let workingHoursDiffLastMonth = workingHoursDiffsData.find(
    (data) =>
      data.employee_id == props.employeeData.id &&
      data.month == (props.month == 1 ? 12 : props.month - 1) &&
      data.year == (props.month == 1 ? props.year - 1 : props.year)
  )

  let workingHoursDiff =
    dutyWorkingHours -
    maxMonthlyWorkingHours +
    (workingHoursDiffLastMonth != undefined
      ? workingHoursDiffLastMonth.diff
      : 0)

  let diffPercent = (workingHoursDiff / maxMonthlyWorkingHours) * 100

  let percentColor =
    diffPercent <= -20
      ? 'percent-20'
      : diffPercent <= -15
      ? 'percent-15'
      : diffPercent <= -10
      ? 'percent-10'
      : diffPercent <= -5
      ? 'percent-5'
      : diffPercent > -5 && diffPercent < 5
      ? 'percent0'
      : diffPercent >= 5 && diffPercent < 10
      ? 'percent5'
      : diffPercent >= 10 && diffPercent < 15
      ? 'percent10'
      : diffPercent >= 15 && diffPercent < 20
      ? 'percent15'
      : 'percent20'

  useEffect(() => {
    if (
      moment().format('M') <= props.month &&
      moment().format('Y') <= props.year
    ) {
      dispatch(
        postWorkingHoursDiff({
          employee_id: props.employeeData.id,
          month: props.month,
          year: props.year,
          diff: workingHoursDiff,
        })
      )
    } else {
      null
    }
  }, [workingHoursDiff])

  return (
    <div className="workingHoursCell">
      <div className={`workingHoursDiff ${percentColor}`}>
        {workingHoursDiff.toFixed(2)}
      </div>
      <div className="sum">{dutyWorkingHours.toFixed(2)}</div>
    </div>
  )
}

export default WorkingHoursCell
