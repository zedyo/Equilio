import React from 'react'
import { Button, Col, Modal, Form, FloatingLabel, Row } from 'react-bootstrap'

function WishCreatorModal(props) {
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
                  <Form.Select aria-label="Floating label select example">
                    <option disabled selected>
                      Bitte Mitarbeiter auswählen
                    </option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md>
                <FloatingLabel controlId="floatingSelect" label="Wunschschicht">
                  <Form.Select aria-label="Floating label select example">
                    <option disabled selected>
                      Bitte Wunschschicht auswählen
                    </option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
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
                  <Form.Control type="wish_day" placeholder="01" />
                </FloatingLabel>
              </Col>
              <Col md className="g-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Monat"
                  className="mb-3"
                >
                  <Form.Select aria-label="Floating label select example">
                    <option disabled selected>
                      Bitte Monat auswählen
                    </option>
                    <option value="1">Januar</option>
                    <option value="2">Februar</option>
                    <option value="3">März</option>
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
                    value="2022"
                    type="wish_year"
                    placeholder="1986"
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onHide}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={props.onHide} type="submit">
            Speichern
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default WishCreatorModal
