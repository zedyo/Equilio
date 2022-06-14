import React, { useState, useEffect } from 'react'
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
import { useParams } from 'react-router-dom'
import { updateEmployeeData } from '../../../features/employees/employeeSlice'
import { BsFillPersonCheckFill } from 'react-icons/bs'

function UpdateEmployee() {
  const params = useParams()
  const dispatch = useDispatch()
  const { employeesData } = useSelector((store) => store.employees)
  const { qualificationsData } = useSelector((store) => store.qualifications)
  const employee = employeesData.find((employee) => employee.id == params.id)

  const [employeeData, setEmployee] = useState({})

  useEffect(() => {
    employee !== undefined && setEmployee(employee)
  }, [employee])

  if (Object.keys(employeeData).length === 0) return <h1>... loading</h1>
  if (Object.keys(qualificationsData).length === 0) return <h1>... loading</h1>

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Bearbeitung von Mitarbeiterdaten</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(updateEmployeeData(employeeData))}
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
                      value={employeeData.first_name}
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </FloatingLabel>
                </Col>
                <Col md>
                  <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                    <Form.Control
                      type="text"
                      placeholder="Musterstein"
                      value={employeeData.last_name}
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          last_name: e.target.value,
                        })
                      }
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
                      value={employeeData.employment_ratio}
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          employment_ratio: e.target.value,
                        })
                      }
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
                      value={employeeData.daily_worktime}
                      onChange={(e) =>
                        setEmployee({
                          ...employeeData,
                          daily_worktime: e.target.value,
                        })
                      }
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
                      defaultValue={employeeData.qualification.id}
                    >
                      <option key="0">Bitte auswählen</option>
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
              </Row>{' '}
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default UpdateEmployee
