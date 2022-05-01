import React, { useState } from 'react'
import {
  Col,
  Row,
  Form,
  FloatingLabel,
  Container,
  Card,
  Button,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postEmployeeData } from '../../../features/employees/employeeSlice'

function CreateEmployee() {
  const dispatch = useDispatch()
  const { qualificationsData } = useSelector((store) => store.qualifications)
  const [employeeData, setEmployee] = useState({})

  return (
    <>
      <Container>
        <Card>
          <Card.Header>Anlegen von Mitarbeiterdaten</Card.Header>
          <Card.Body>
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
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="g-2">
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Irgendwas">
                  <Form.Control type="text" placeholder="Dings" />
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
            </Row>
            <Button
              onClick={() => dispatch(postEmployeeData(employeeData))}
              variant="outline-success"
              href={`/employees`}
            >
              Speichern
            </Button>{' '}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default CreateEmployee
