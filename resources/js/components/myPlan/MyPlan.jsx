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

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember',
]

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
              <Table size="sm" bordered hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '6rem' }}>Tag</th>
                    <th>Dienst</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (day) => {
                      const duty = dutyByDay[day]
                      const date = new Date(year, month - 1, day)
                      const weekend = [0, 6].includes(date.getDay())
                      return (
                        <tr
                          key={day}
                          style={
                            weekend ? { background: '#f7f7f9' } : undefined
                          }
                        >
                          <td>{day}.</td>
                          <td>
                            {duty && duty.shift ? (
                              <span
                                style={{
                                  color: duty.shift.color_hex,
                                  fontWeight: 600,
                                }}
                              >
                                {duty.shift.abrv}
                              </span>
                            ) : (
                              <span className="text-muted">frei</span>
                            )}
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </Table>
              <small className="text-muted">
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
