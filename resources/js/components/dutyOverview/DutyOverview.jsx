import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Alert, Badge, Button, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  generateRoster,
  getDutiesDataByMonth,
} from '../../features/duties/dutySlice'
import { daysToArray } from '../../util/daysToArray'
import DateSelector from './dateSelector/DateSelector'
import DaysRow from './daysRow/DaysRow'
import './DutyOverview.scss'
import EmployeeRow from './employeeRow/EmployeeRow'
import { holidays } from './daysRow/utils/holidays'
import ShiftTypeStatisticsContainer from './shiftTypeStatisticsContainer/ShiftTypeStatisticsContainer'
import Spinner from 'react-bootstrap/Spinner'

function DutyOverview() {
  moment.locale('de')

  const [dateSelectorData, setDateSelector] = useState({
    month: `${moment().format('M')}`,
    year: `${moment().format('YYYY')}`,
  })
  const { dutiesData, isLoading, isGenerating, generatorSummary } =
    useSelector((store) => store.duties)
  const { employeesData } = useSelector((store) => store.employees)
  const { wishesData } = useSelector((store) => store.wishes)
  const { qualificationsData } = useSelector((store) => store.qualifications)
  const dispatch = useDispatch()
  const monthlyDays = daysToArray(dateSelectorData.year, dateSelectorData.month)

  useEffect(() => {
    dispatch(getDutiesDataByMonth(dateSelectorData))
  }, [dateSelectorData])

  const workingDays = monthlyDays.filter(
    (day) =>
      moment(
        `${dateSelectorData.year}-${dateSelectorData.month}-${day}`,
        'YYYY-M-D'
      ).format('dd') !== 'So' &&
      moment(
        `${dateSelectorData.year}-${dateSelectorData.month}-${day}`,
        'YYYY-M-D'
      ).format('dd') !== 'Sa' &&
      holidays.find(
        (holiday) =>
          holiday.date ===
          moment(
            `${dateSelectorData.year}-${dateSelectorData.month}-${day}`,
            'YYYY-M-D'
          ).format('YYYY-MM-DD')
      ) == undefined
  )

  if (dutiesData.length > 0 || isLoading == false) {
    return (
      <>
        <Container fluid className="dutyOverviewContainer">
          <div className="dateSelectorBar">
            <DateSelector
              key="datechecker-render"
              dateSelectorData={dateSelectorData}
              setDateSelector={setDateSelector}
            />
          </div>
          <div className="generatorBar">
            <Button
              variant="primary"
              disabled={isGenerating}
              onClick={() =>
                dispatch(
                  generateRoster({
                    year: dateSelectorData.year,
                    month: dateSelectorData.month,
                  })
                )
              }
            >
              {isGenerating ? (
                <>
                  <Spinner animation="border" size="sm" /> Generiere…
                </>
              ) : (
                'Plan automatisch generieren'
              )}
            </Button>
            {generatorSummary && (
              <span className="generatorSummary">
                <Badge bg="secondary">
                  Belastungsindex: {generatorSummary.total_strain}
                </Badge>{' '}
                <Badge bg="secondary">
                  Dienste: {generatorSummary.assigned_duties}
                </Badge>{' '}
                {generatorSummary.missing_qualification > 0 && (
                  <>
                    <Badge bg="warning" text="dark">
                      ohne Fachkraft:{' '}
                      {generatorSummary.missing_qualification}
                    </Badge>{' '}
                  </>
                )}
                {generatorSummary.forbidden ? (
                  <Badge bg="danger">unzulässige Konstellation</Badge>
                ) : (
                  <Badge bg="success">regelkonform</Badge>
                )}
              </span>
            )}
          </div>
          {generatorSummary && generatorSummary.forbidden && (
            <Alert variant="warning" className="generatorAlert">
              Der Vorschlag enthält noch unzulässige Konstellationen
              (z. B. zu viele Dienste in Folge oder Unterbesetzung) und muss
              manuell nachjustiert werden.
            </Alert>
          )}
          <div className="dutyBoard">
            <DaysRow
              monthlyDays={monthlyDays}
              dateSelectorData={dateSelectorData}
            />
            <div>
              {qualificationsData.map((qualification) => {
              return (
                employeesData.filter(
                  (employee) => employee.qualification.id == qualification.id
                ).length > 0 && (
                  <div key={'qualifcationSection:' + qualification.id}>
                    <div className="qualificationSection">
                      {`${qualification.description}${
                        employeesData.filter(
                          (employee) =>
                            employee.qualification.id == qualification.id
                        ).length > 1
                          ? 'nen'
                          : ''
                      }`}
                    </div>
                    {employeesData
                      .filter(
                        (employee) =>
                          employee.qualification.id == qualification.id
                      )
                      .map((employee) => (
                        <EmployeeRow
                          key={
                            'EmployeeRow:' +
                            employee.id +
                            dateSelectorData.year +
                            dateSelectorData.month +
                            qualification.id
                          }
                          employeeData={employee}
                          dateSelectorData={dateSelectorData}
                          days={monthlyDays}
                          workingDays={workingDays}
                          employeeDuties={dutiesData.filter(
                            (d) => d.employee_id === employee.id
                          )}
                          employeeWishes={wishesData.filter(
                            (d) => d.employee_id === employee.id
                          )}
                        />
                      ))}
                  </div>
                )
              )
            })}
          </div>
            <div className="separator" />
            <div>
              <ShiftTypeStatisticsContainer
                key={
                  'ShiftTypeStatisticsContainer: ' +
                  dateSelectorData.year +
                  dateSelectorData.month
                }
                days={monthlyDays}
                dateSelectorData={dateSelectorData}
              />
            </div>
          </div>
        </Container>
      </>
    )
  } else {
    return (
      <>
        <Container fluid className="dutyOverviewContainer">
          <div className="dateSelectorBar">
            <DateSelector
              key="datechecker-render"
              dateSelectorData={dateSelectorData}
              setDateSelector={setDateSelector}
            />
          </div>

          <Container>
            <Row>
              <Col>
                <div
                  style={{
                    height: '70vh',
                    display: 'grid',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spinner animation="border" variant="secondary" />
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </>
    )
  }
}

export default DutyOverview
