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
  InputGroup,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Preferences from './preferences/Preferences'
import WishColumn from './wishColumn/WishColumn'

function EmployeeOverview() {
  const params = useParams()

  const { employeesData } = useSelector((store) => store.employees)
  const employee = employeesData.find((employee) => employee.id == params.id)

  const [employeeData, setEmployee] = useState({})
  const [wishesData, setWishes] = useState([])

  useEffect(() => {
    employee !== undefined && setEmployee(employee)
  }, [employee])

  useEffect(() => {
    async function getWishesData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/wishesByEmployee/${params.id}/`,
          {}
        )
        setWishes(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    getWishesData()
  }, [])

  //TODO: Auf Redux umbauen
  async function destroyWish(deletedWishId) {
    try {
      const deleted_data = await axios.delete(
        `http://127.0.0.1:8000/api/wishes/${deletedWishId}/`
      )
      setWishes(
        wishesData.filter(
          (wish) => wish.id !== deleted_data.data.deleted_wish.id
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  if (Object.keys(employeeData).length === 0) return <h1>... loading</h1>

  return (
    <Fragment>
      <Container>
        <Card>
          <Card.Header>Mitarbeiterdetails</Card.Header>
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
                      placeholder="Dings"
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
                      placeholder="Dings"
                      value={employeeData.daily_worktime}
                      disabled
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel
                    controlId="floatingInputGrid"
                    label="Qualification"
                  >
                    <Form.Control
                      type="text"
                      value={employeeData.qualification.description}
                      placeholder="Dings"
                      disabled
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col>
                  {/* <Card> */}
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
                        {wishesData.map((wishObject) => (
                          <WishColumn
                            key={wishObject.id}
                            wish={wishObject}
                            deleteWish={destroyWish}
                          />
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                  {/* </Card> */}
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
