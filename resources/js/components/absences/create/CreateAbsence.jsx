import React, { useState } from 'react'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Stack,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postAbsenceData } from '../../../features/absences/absenceSlice'
import { ABSENCE_TYPE_LABELS } from '../AbsencesOverview'

function CreateAbsence() {
  const dispatch = useDispatch()
  const { employeesData } = useSelector((store) => store.employees)
  const [absence, setAbsence] = useState({ type: 'vacation' })

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
        <Breadcrumb.Item href="/absences">
          Einstellungen: Abwesenheiten
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Neue Abwesenheit</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>
          <Stack direction="horizontal" gap={3}>
            <div>Neue Abwesenheit</div>
            <div className="ms-auto">
              <Button
                onClick={() => dispatch(postAbsenceData(absence))}
                variant="outline-primary"
                href="/absences"
              >
                Speichern
              </Button>
            </div>
          </Stack>
        </Card.Header>
        <Card.Body>
          <Stack gap={2}>
            <Row className="g-2">
              <Col md>
                <FloatingLabel controlId="abEmployee" label="Mitarbeiter">
                  <Form.Select
                    onChange={(e) =>
                      setAbsence({
                        ...absence,
                        employee_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <option key="0">-- Bitte auswählen --</option>
                    {employeesData.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="abType" label="Art">
                  <Form.Select
                    defaultValue="vacation"
                    onChange={(e) =>
                      setAbsence({ ...absence, type: e.target.value })
                    }
                  >
                    {Object.entries(ABSENCE_TYPE_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="g-2">
              <Col md>
                <FloatingLabel controlId="abStart" label="Von">
                  <Form.Control
                    type="date"
                    onChange={(e) =>
                      setAbsence({ ...absence, start_date: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="abEnd" label="Bis">
                  <Form.Control
                    type="date"
                    onChange={(e) =>
                      setAbsence({ ...absence, end_date: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="abNote" label="Notiz (optional)">
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      setAbsence({ ...absence, note: e.target.value })
                    }
                    autoComplete="off"
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CreateAbsence
