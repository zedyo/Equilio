import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getDutiesDataByMonth } from '../../features/duties/dutySlice'
import { daysToArray } from '../../util/daysToArray'
import DateSelector from './dateSelector/DateSelector'
import DaysRow from './daysRow/DaysRow'
import './DutyOverview.scss'
import EmployeeRow from './employeeRow/EmployeeRow'

function DutyOverview() {
  moment.locale('de')

  const [dateSelectorData, setDateSelector] = useState({
    month: `${moment().format('M')}`,
    year: `${moment().format('YYYY')}`,
  })
  const { dutiesData } = useSelector((store) => store.duties)
  const { employeesData } = useSelector((store) => store.employees)
  const [allWishes, setAllWishes] = useState([])
  const dispatch = useDispatch()
  const monthlyDays = daysToArray(dateSelectorData.year, dateSelectorData.month)

  useEffect(() => {
    dispatch(getDutiesDataByMonth(dateSelectorData))
  }, [dateSelectorData])

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/wishes/')
      setAllWishes(data.wishes)
      //TODO: Abholen für den jeweiligen Monat/Jahr direkt?
    }
    getData()
  }, [])

  return (
    <>
      <Container key="container">
        <div className="dateRow">
          <div className="dateSelector">
            <DateSelector
              key="datechecker-render"
              dateSelectorData={dateSelectorData}
              setDateSelector={setDateSelector}
            />
          </div>

          <div>
            <DaysRow
              monthlyDays={monthlyDays}
              dateSelectorData={dateSelectorData}
            />
          </div>
        </div>

        <div>
          {employeesData &&
            employeesData.map((employee) => (
              <EmployeeRow
                key={
                  'EmployeeRow:' +
                  employee.id +
                  dateSelectorData.year +
                  dateSelectorData.month
                }
                employeeData={employee}
                dateSelectorData={dateSelectorData}
                days={monthlyDays}
                employeeDuties={dutiesData.filter(
                  (d) => d.employee_id === employee.id
                )}
                employeeWishes={allWishes.filter(
                  (d) => d.employee_id === employee.id
                )}
              />
            ))}
        </div>
        <div className="separator" />
        {/* <ShiftTypeStatisticsContainer
          key={
            'ShiftTypeStatisticsContainer: ' +
            dateSelectorData.year +
            dateSelectorData.month
          }
          days={monthlyDays}
          dateSelectorData={dateSelectorData}
          allDuties={dutiesData}
        /> */}
      </Container>
    </>
  )
}

export default DutyOverview
