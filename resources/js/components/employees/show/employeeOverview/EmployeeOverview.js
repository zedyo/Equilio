import React, { Fragment, useState, useEffect } from 'react'
import {
  Col,
  Row,
  Form,
  FloatingLabel,
  Container,
  Card,
  Table,
} from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import WishColumn from './wishColumn/WishColumn'

function EmployeeOverview() {
  const params = useParams()
  const history = useHistory()
  const [employeeData, setEmployee] = useState({})
  const [wishesData, setWishes] = useState([])

  useEffect(() => {
    async function getEmployeeData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/employees/${params.id}/`,
          {}
        )
        setEmployee(data.employee)
      } catch (error) {
        console.log(error.message)
      }
    }

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
    getEmployeeData()
  }, [])

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

  console.log(employeeData)

  if (Object.keys(employeeData).length === 0) return <h1>... loading</h1>

  return (
    <Fragment>
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
              <Col md>
                <FloatingLabel controlId="floatingInputGrid" label="Irgendwas">
                  <Form.Control type="text" placeholder="Dings" disabled />
                </FloatingLabel>
              </Col>
              <Col md>
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
        </Card>
      </Container>
    </Fragment>
  )
}

export default EmployeeOverview
