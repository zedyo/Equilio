import React, { Fragment, useState, useEffect } from 'react'
import {
  Col,
  Row,
  Form,
  FloatingLabel,
  Container,
  Card,
  Table,
  Stack,
  Button,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Preferences from './preferences/Preferences'
import WishColumn from './wishColumn/WishColumn'
import { FaUserEdit } from 'react-icons/fa'

function EmployeeOverview() {
  const params = useParams()

  const { employeesData } = useSelector((store) => store.employees)
  const { wishesData } = useSelector((store) => store.wishes)

  const employee = employeesData.find((employee) => employee.id == params.id)
  const employeeWishesData = wishesData.filter(
    (data) => data.employee_id == params.id
  )

  const [employeeData, setEmployee] = useState({})

  useEffect(() => {
    employee !== undefined && setEmployee(employee)
  }, [employee])

  if (Object.keys(employeeData).length === 0) return <h1>... loading</h1>

  return (
    <Fragment>
      <Container>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Mitarbeiterdetails</div>
              <div className="ms-auto">
                <Button
                  href={`/employee/edit/${employeeData.id}`}
                  variant="outline-secondary"
                >
                  <FaUserEdit /> Mitarbeiterdaten bearbeiten
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
                      disabled
                    />
                  </FloatingLabel>
                </Col>
                <Col md>
                  <FloatingLabel controlId="floatingInputGrid" label="Nachname">
                    <Form.Control
                      type="text"
                      placeholder="Musterstein"
                      value={employeeData.last_name}
                      disabled
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
                      disabled
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
                      disabled
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel
                    controlId="floatingInputGrid"
                    label="Qualifikation"
                  >
                    <Form.Control
                      type="Pflger:in"
                      value={employeeData.qualification.description}
                      placeholder="Dings"
                      disabled
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Body>
                    <Card.Title>Dienst Wünsche</Card.Title>
                    <Table>
                      <thead>
                        <tr>
                          <th>Datum</th>
                          <th>Dienst</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeWishesData.map((wishObject) => (
                          <WishColumn key={wishObject.id} wish={wishObject} />
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Col>
                <Col>
                  <Card.Body>
                    <Card.Title>Dienst Präferenzen</Card.Title>
                    <Preferences employeeId={employee.id} />
                  </Card.Body>
                </Col>
              </Row>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  )
}

export default EmployeeOverview
