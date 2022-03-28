import React, { useEffect, useState, Fragment } from 'react'
import axios from 'axios'
import EmployeeRow from './employeeRow/EmployeeRow'
import DaysRow from './daysRow/DaysRow'
import DateSelector from './dateSelector/DateSelector'
import ShiftTypeStatisticsContainer from './shiftTypeStatisticsContainer/ShiftTypeStatisticsContainer'
import moment from 'moment'
import { Container } from 'react-bootstrap'
import { daysToArray } from '../../util/daysToArray'
import './DutyOverview.scss'

function Duties() {
  moment.locale('de')

  const [employeeData, setEmployeeData] = useState(null)
  const [allDuties, setAllDuties] = useState([])
  console.log(employeeData)
  const [dateSelectorData, setDateSelector] = useState({
    month: `${moment().format('M')}`,
    year: `${moment().format('YYYY')}`,
  })

  const days = daysToArray(dateSelectorData.year, dateSelectorData.month)

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/duties/')
      setEmployeeData(data.employees)
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
            <DaysRow days={days} dateSelectorData={dateSelectorData} />
          </div>
        </div>

        <div>
          {employeeData &&
            employeeData.map((employeeObject) => (
              <EmployeeRow
                key={Math.random()}
                employeeData={employeeObject}
                dateSelectorData={dateSelectorData}
                days={days}
                allDuties={allDuties}
              />
            ))}
        </div>
        <div className="separator" />
        <ShiftTypeStatisticsContainer
          key={'d'}
          days={days}
          dateSelectorData={dateSelectorData}
          allDuties={allDuties}
        />
      </Container>
    </Fragment>
  )
}

export default Duties
