import React, { useState } from 'react'
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

function WishCreatorModal(props) {
  const [wishData, setWish] = useState({})
  const { employeesData } = useSelector((store) => store.employees)
  const { shiftsData } = useSelector((store) => store.shifts)

  function emptyWishState() {
    setWish({})
  }

  async function submitWish() {
    try {
      console.log(wishData)
      await axios.post(`http://127.0.0.1:8000/api/wish`, {
        wishData,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  //TODO: WunschModal hübscher gestalten

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Dienstwunsch anlegen
        </Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Row className="g-3">
              <Col md>
                <FloatingLabel controlId="floatingSelect" label="Mitarbeiter">
                  <Form.Select
                    aria-label="Floating label select example"
                    onChange={(e) =>
                      e.target.value !== null &&
                      setWish({
                        ...wishData,
                        employee_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <option key="employee: null" value={null}>
                      Bitte Mitarbeiter auswählen
                    </option>
                    {employeesData !== undefined &&
                      employeesData.map((employee) => (
                        <option
                          key={'Employee: ' + employee.id}
                          value={employee.id}
                        >
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="floatingSelect" label="Wunschschicht">
                  {/* <Form.Select
                    aria-label="Floating label select example"
                    onChange={(e) =>
                      e.target.value !== null &&
                      setWish({
                        ...wishData,
                        shift_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={null}>Bitte Wunschschicht auswählen</option>
                    <option value={1}>F1</option>
                    <option value={2}>F2</option>
                    <option value={3}>S1</option>
                  </Form.Select> */}
                  <Form.Select
                    aria-label="Floating label select example"
                    onChange={(e) =>
                      e.target.value !== null &&
                      setWish({
                        ...wishData,
                        shift_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <option key="shift: null" value={null}>
                      Bitte Schicht auswählen
                    </option>
                    {shiftsData !== undefined &&
                      shiftsData.map((shift) => (
                        <option key={'Shift: ' + shift.id} value={shift.id}>
                          {`${shift.abrv} ( ${shift.shift_type.name} )`}
                        </option>
                      ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md className="g-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Tag"
                  className="mb-3"
                >
                  <Form.Control
                    type="wish_day"
                    placeholder="01"
                    onChange={(e) =>
                      setWish({ ...wishData, day: parseInt(e.target.value) })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col md className="g-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Monat"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    onChange={(e) =>
                      e.target.value !== null &&
                      setWish({ ...wishData, month: parseInt(e.target.value) })
                    }
                  >
                    <option value={null}>Bitte Monat auswählen</option>
                    <option value={1}>Januar</option>
                    <option value={2}>Februar</option>
                    <option value={3}>März</option>
                    <option value={4}>April</option>
                    <option value={5}>Mai</option>
                    <option value={6}>Juni</option>
                    <option value={7}>Juli</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>Oktober</option>
                    <option value={11}>November</option>
                    <option value={12}>Dezember</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md className="g-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Jahr"
                  className="mb-3"
                >
                  <Form.Control
                    type="wish_year"
                    placeholder="1986"
                    onChange={(e) =>
                      setWish({ ...wishData, year: parseInt(e.target.value) })
                    }
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={(emptyWishState, props.onHide)}
          >
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={
              //TODO: Braucht man das onHide im Wunschmodal?
              /*props.onHide*/ submitWish
            }
            type="submit"
          >
            Speichern
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default WishCreatorModal
