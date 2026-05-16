import React, { useState } from 'react'
import { Button, Col, FloatingLabel, Form, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postWishesData } from '../../../../../../features/wishes/wishSlice'
import moment from 'moment'
import WishDatePicker from '../../../../dateSelector/WishDatePicker'

function WishCreatorModal(props) {
  const dispatch = useDispatch()
  const now = moment()
  const [wishData, setWish] = useState({
    employee_id: props.employeeId,
    day: Number(now.format('D')),
    month: Number(now.format('M')),
    year: Number(now.format('YYYY')),
  })
  const { employeesData } = useSelector((store) => store.employees)
  const { shiftsData } = useSelector((store) => store.shifts)

  function emptyWishState() {
    setWish({})
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
          Neuer Dienstwunsch
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
                    defaultValue={props.employeeId}
                  >
                    <option key="employee: null" value={null}>
                      -- Bitte auswählen --
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
                  <Form.Select
                    aria-label="Wish"
                    onChange={(e) =>
                      e.target.value !== null &&
                      setWish({
                        ...wishData,
                        shift_id: parseInt(e.target.value),
                      })
                    }
                  >
                    <option key="shift: null" value={null}>
                      -- Bitte auswählen --
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
              <Col className="g-3">
                <Form.Label className="text-muted small mb-1">
                  Wunschtag
                </Form.Label>
                <WishDatePicker
                  value={{
                    day: wishData.day,
                    month: wishData.month,
                    year: wishData.year,
                  }}
                  onChange={(date) => setWish({ ...wishData, ...date })}
                />
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
            onClick={() => dispatch(postWishesData(wishData))}
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
