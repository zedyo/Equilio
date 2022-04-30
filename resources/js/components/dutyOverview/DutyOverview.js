import './DutyOverview.scss'
import DateSelector from './dateSelector/DateSelector'
import DaysRow from './daysRow/DaysRow'
import EmployeeRow from './employeeRow/EmployeeRow'
import React, { useEffect, useState, Fragment } from 'react'
import ShiftTypeStatisticsContainer from './shiftTypeStatisticsContainer/ShiftTypeStatisticsContainer'
import axios from 'axios'
import moment from 'moment'
import { Container } from 'react-bootstrap'
import { daysToArray } from '../../util/daysToArray'
import { fillEmployees } from '../../features/employees/employeeSlice'
import { useDispatch } from 'react-redux'

function Duties() {
  moment.locale('de')

  const [dateSelectorData, setDateSelector] = useState({
    month: `${moment().format('M')}`,
    year: `${moment().format('YYYY')}`,
  })

  const [employeeData, setEmployeeData] = useState(null)
  const [allDuties, setAllDuties] = useState([])
  const [allWishes, setAllWishes] = useState([])
  const employeeDispatch = useDispatch()

  const monthlyDays = daysToArray(dateSelectorData.year, dateSelectorData.month)

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/duties/')
      setEmployeeData(data.employees)
      employeeDispatch(fillEmployees(data.employees))
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/wishes/')
      setAllWishes(data.wishes)
      //TODO: Abholen für den jeweiligen Monat/Jahr direkt?
    }
    getData()
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/api/duties/${dateSelectorData.year}/${dateSelectorData.month}`,
        {}
      )
      setAllDuties(data.duties)
    })()
  }, [dateSelectorData])

  return (
    <Fragment>
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
          {employeeData &&
            employeeData.map((employee) => (
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
                employeeDuties={allDuties.filter(
                  (d) => d.employee_id === employee.id
                )}
                employeeWishes={allWishes.filter(
                  (d) => d.employee_id === employee.id
                )}
              />
            ))}
        </div>
        <div className="separator" />
        <ShiftTypeStatisticsContainer
          key={
            'ShiftTypeStatisticsContainer: ' +
            dateSelectorData.year +
            dateSelectorData.month
          }
          days={monthlyDays}
          dateSelectorData={dateSelectorData}
          allDuties={allDuties}
        />
      </Container>
    </Fragment>
  )
}

export default Duties
