import React, { useEffect, useMemo } from 'react'
import {
  Badge,
  Button,
  Card,
  Container,
  Stack,
  Tab,
  Table,
  Tabs,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth } from '../../features/auth/authSlice'
import { getOwnDutiesByMonth } from '../../features/duties/dutySlice'
import { getWishesByEmployee } from '../../features/wishes/wishSlice'
import { getPreferencesByEmployee } from '../../features/preferences/preferenceSlice'
import WishCreator from '../dutyOverview/employeeRow/employeeCell/wishCreator/WishCreator'
import Preferences from '../employees/show/employeeOverview/preferences/Preferences'
import './myPlan.scss'

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember',
]

// Montag-basierte Wochenansicht (deutsche Konvention).
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function MyPlan() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const { ownDuties } = useSelector((store) => store.duties)
  const { wishesData } = useSelector((store) => store.wishes)

  const employeeId = user?.employee_id
  const now = new Date()
  const [year, setYear] = React.useState(now.getFullYear())
  const [month, setMonth] = React.useState(now.getMonth() + 1)

  const reloadWishes = () =>
    employeeId && dispatch(getWishesByEmployee(employeeId))

  useEffect(() => {
    if (!employeeId) return
    dispatch(getOwnDutiesByMonth({ year, month, employeeId }))
    dispatch(getWishesByEmployee(employeeId))
    dispatch(getPreferencesByEmployee(employeeId))
  }, [dispatch, employeeId, year, month])

  const daysInMonth = new Date(year, month, 0).getDate()

  const dutyByDay = useMemo(() => {
    const map = {}
    ;(ownDuties || []).forEach((d) => {
      map[d.day] = d
    })
    return map
  }, [ownDuties])

  // Kalenderzellen: führende Leerzellen bis zum 1., dann die Tage,
  // aufgefüllt auf volle Wochen (7er-Raster, Montag zuerst).
  const calendarCells = useMemo(() => {
    const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7
    const cells = Array.from({ length: firstWeekday }, () => null)
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month, daysInMonth])

  const isToday = (day) =>
    day === now.getDate() &&
    month === now.getMonth() + 1 &&
    year === now.getFullYear()

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 1) {
      m = 12
      y -= 1
    } else if (m > 12) {
      m = 1
      y += 1
    }
    setMonth(m)
    setYear(y)
  }

  if (!employeeId) {
    return (
      <Container className="py-4">
        <Card body>
          Dieser Account ist keiner Mitarbeiter:in zugeordnet. Bitte an die
          Leitung wenden.
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h4 className="mb-0">
          Hallo {user?.employee?.first_name || user?.name}
        </h4>
        <Badge bg="info" className="ms-2">
          Pflegekraft
        </Badge>
      </Stack>

      <Tabs defaultActiveKey="plan" className="mb-3">
        <Tab eventKey="plan" title="Mein Dienstplan">
          <Card>
            <Card.Header>
              <Stack direction="horizontal" gap={2}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => shiftMonth(-1)}
                >
                  ‹
                </Button>
                <strong>
                  {MONTHS[month - 1]} {year}
                </strong>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => shiftMonth(1)}
                >
                  ›
                </Button>
              </Stack>
            </Card.Header>
            <Card.Body>
              <div className="myplan-weekhead">
                {WEEKDAYS.map((wd, i) => (
                  <div key={wd} className={i >= 5 ? 'is-weekend' : undefined}>
                    {wd}
                  </div>
                ))}
              </div>
              <div className="myplan-grid">
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="myplan-cell myplan-cell--empty"
                        aria-hidden="true"
                      />
                    )
                  }
                  const duty = dutyByDay[day]
                  const weekend = idx % 7 >= 5
                  const today = isToday(day)
                  const classes = [
                    'myplan-cell',
                    weekend ? 'myplan-cell--weekend' : '',
                    today ? 'myplan-cell--today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <div key={day} className={classes}>
                      <span className="myplan-daynum">{day}</span>
                      {duty && duty.shift ? (
                        <span
                          className="myplan-shift"
                          style={{ background: duty.shift.color_hex }}
                          title={duty.shift.abrv}
                        >
                          {duty.shift.abrv}
                        </span>
                      ) : (
                        <span className="myplan-free">frei</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <small className="text-muted d-block mt-3">
                Nur-Lese-Ansicht. Änderungen nimmt die Leitung vor.
              </small>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="wishes" title="Meine Wünsche">
          <Card>
            <Card.Body>
              <Stack direction="horizontal" className="mb-3">
                <Card.Title className="mb-0">Dienstwünsche</Card.Title>
                <div className="ms-auto">
                  <WishCreator
                    employeeId={employeeId}
                    employeeName={user?.employee?.first_name || user?.name}
                    defaultDate={{ month, year }}
                    onSaved={reloadWishes}
                  />
                </div>
              </Stack>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Dienst</th>
                  </tr>
                </thead>
                <tbody>
                  {(wishesData || [])
                    .filter((w) => Number(w.employee_id) === Number(employeeId))
                    .map((w) => (
                      <tr key={w.id}>
                        <td>
                          {w.day}.{w.month}.{w.year}
                        </td>
                        <td
                          style={{
                            color: w.shift?.color_hex,
                            fontWeight: 600,
                          }}
                        >
                          {w.shift?.abrv || w.shift_id}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="prefs" title="Meine Präferenzen">
          <Card>
            <Card.Body>
              <Card.Title>Schicht-Präferenzen</Card.Title>
              <Preferences employeeId={employeeId} />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default MyPlan
