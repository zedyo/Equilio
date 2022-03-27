import React, { useEffect, useState, Fragment } from 'react'
import axios from 'axios'
import DutiesRow from './dutiesRow/DutiesRow'
import DaysRow from './daysRow/DaysRow'
import DateSelector from './dateSelector/DateSelector'
import ShiftTypeStatisticsContainer from './shiftTypeStatisticsContainer/ShiftTypeStatisticsContainer'
import moment from 'moment'
import { Container } from 'react-bootstrap'
import { daysToArray } from '../../util/daysToArray'
import './DutyOverview.scss'

function Duties() {
  moment.locale('de')

  const [dutiesData, setDuty] = useState(null)
  const [allDuties, setAllDuties] = useState([])

  const [dateSelectorData, setDateSelector] = useState({
    month: `${moment().format('M')}`,
    year: `${moment().format('YYYY')}`,
  })

  //console.log(dateSelectorData);

  const days = daysToArray(dateSelectorData.year, dateSelectorData.month)

  useEffect(() => {
    async function getData() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/duties/')
      setDuty(data.employees)
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
            <DaysRow days={days} checkerData={dateSelectorData} />
          </div>
        </div>

        <div>
          {dutiesData &&
            dutiesData.map((dutyObject) => (
              <DutiesRow
                key={Math.random()}
                dutiesData={dutyObject}
                checkerData={dateSelectorData}
                days={days}
                allDuties={allDuties}
              />
            ))}
        </div>
        <div className="separator" />
        <ShiftTypeStatisticsContainer
          key={'d'}
          days={days}
          checkerData={dateSelectorData}
          allDuties={allDuties}
        />
      </Container>
    </Fragment>
  )
}

export default Duties
