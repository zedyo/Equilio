import React, { useState } from 'react'
import {
  Col,
  Row,
  Form,
  FloatingLabel,
  Container,
  Card,
  Button,
  Stack,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postEmployeeData } from '../../../features/employees/employeeSlice'
import { BsFillPersonCheckFill } from 'react-icons/bs'

function CreateEmployee() {
  const dispatch = useDispatch()
  const { qualificationsData } = useSelector((store) => store.qualifications)
  const [employeeData, setEmployee] = useState({})

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Neuer Angestellter</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(postEmployeeData(employeeData))}
                  variant="outline-primary"
                  href={`/employees`}
                >
                  <BsFillPersonCheckFill /> Speichern
                </Button>
              </div>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Stack gap={2}>
              <Row className="g-2">
                <Col md>
                  <FloatingLabel controlId="floatingInputGrid" label="Vorname">
                    <Form.Control
                      type="text"
                      placeholder="Klara"
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          first_name: e.target.value,
                        })
                      }
                      autoComplete="off"
                    />
                  </FloatingLabel>
                </Col>
                <Col md>
                  <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                    <Form.Control
                      type="text"
                      placeholder="Musterstein"
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          last_name: e.target.value,
                        })
                      }
                      autoComplete="off"
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="g-2">
                <Col md={3}>
                  <FloatingLabel
                    controlId="floatingInputGrid"
                    label="Anstellung in %"
                  >
                    <Form.Control
                      type="text"
                      placeholder="100"
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          employment_ratio: e.target.value,
                        })
                      }
                      autoComplete="off"
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel
                    controlId="floatingInputGrid"
                    label="Tägliche Stundenarbeitszeit"
                  >
                    <Form.Control
                      type="text"
                      placeholder="8.0"
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          daily_worktime: e.target.value,
                        })
                      }
                      autoComplete="off"
                    />
                  </FloatingLabel>
                </Col>
                <Col md>
                  <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Qualifikation"
                  >
                    <Form.Select
                      aria-label="Floating label select example"
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          qualification_id: parseInt(e.target.value),
                        })
                      }
                    >
                      <option key="0">-- Bitte auswählen --</option>
                      {qualificationsData.map((qualificationObject) => (
                        <option
                          key={qualificationObject.id}
                          value={qualificationObject.id}
                        >
                          {qualificationObject.description}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default CreateEmployee
