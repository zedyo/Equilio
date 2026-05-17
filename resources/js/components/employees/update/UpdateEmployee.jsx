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
import { FiChevronLeft } from 'react-icons/fi'

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

  if (
    Object.keys(employeeData).length === 0 ||
    Object.keys(qualificationsData).length === 0
  )
    return <Container className="py-4 text-muted">Lädt …</Container>

  return (
    <>
      <Container className="py-4">
        <a
          href={`/employee/show/${employeeData.id}`}
          className="eq-page-header__back"
        >
          <FiChevronLeft /> {employeeData.first_name}{' '}
          {employeeData.last_name}
        </a>
        <Card className="mt-2">
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Daten Bearbeitung</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(updateEmployeeData(employeeData))}
                  variant="primary"
                  href={`/employee/show/${employeeData.id}`}
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
