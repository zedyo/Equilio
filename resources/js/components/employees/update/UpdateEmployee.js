import React, { useState, useEffect } from 'react'
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
import { useParams } from 'react-router-dom'
import { updateEmployeeData } from '../../../features/employees/employeeSlice'

function UpdateEmployee() {
  const params = useParams()
  const dispatch = useDispatch()
  const { employeesData } = useSelector((store) => store.employees)
  const employee = employeesData.find((employee) => employee.id == params.id)

  const [employeeData, setEmployee] = useState({})
  const [qualificationData, setQualification] = useState([])

  useEffect(() => {
    employee !== undefined && setEmployee(employee)
  }, [employee])

  useEffect(() => {
    async function getQualificationData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/qualifications`
        )
        setQualification(data.qualifications)
      } catch (error) {
        console.log(error.message)
      }
    }

    getQualificationData()
  }, [])

  if (Object.keys(employeeData).length === 0) return <h1>... loading</h1>
  if (Object.keys(qualificationData).length === 0) return <h1>... loading</h1>

  return (
    <>
      <Container>
        <Card>
          <Card.Header>Bearbeitung von Mitarbeiterdaten</Card.Header>
          <Card.Body>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="ID">
                <Form.Control
                  type="text"
                  placeholder="Klara"
                  value={employeeData.id}
                  disabled
                />
              </FloatingLabel>
            </Col>
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
                    {qualificationData.map((qualificationObject) => (
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
              onClick={() => dispatch(updateEmployeeData(employeeData))}
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

export default UpdateEmployee
