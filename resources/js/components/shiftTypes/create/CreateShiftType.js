import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Stack,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { postShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaCheck } from 'react-icons/fa'

function CreateShiftType() {
  const dispatch = useDispatch()

  const [shiftTypesData, setShiftType] = useState({
    active_duty: 0,
    min_occupation: 0,
    opt_occupation: 0,
  })

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Neue Schichtart</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(postShiftTypesData(shiftTypesData))}
                  variant="outline-primary"
                  href={`/shift_types`}
                >
                  <FaCheck /> Speichern
                </Button>
              </div>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Card.Title>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="shift_type_name">
                        Bezeichnung
                      </InputGroup.Text>
                      <FormControl
                        placeholder="Sonstige Schicht"
                        aria-label="Bezeichnung"
                        aria-describedby="shift_type_name"
                        onChange={(event) =>
                          setShiftType({
                            ...shiftTypesData,
                            name: event.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Card.Title>
                </Col>

                <Col xs lg="3">
                  <InputGroup>
                    <InputGroup.Text id="shift_type_name">
                      Mindestbesetzung unter
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Berufsbeziechnung"
                      aria-label="Bezeichnung"
                      aria-describedby="shift_type_name"
                      value={shiftTypesData.min_occupation}
                      onChange={(e) =>
                        setShiftType({
                          ...shiftTypesData,
                          min_occupation: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Col>

                <Col xs lg="3">
                  <InputGroup>
                    <InputGroup.Text id="shift_type_name">
                      Überbesetzung
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Berufsbeziechnung"
                      aria-label="Bezeichnung"
                      aria-describedby="shift_type_name"
                      value={shiftTypesData.opt_occupation}
                      onChange={(e) =>
                        setShiftType({
                          ...shiftTypesData,
                          opt_occupation: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Col>

                <Col xs lg="2" style={{ margin: '0.3rem 0' }}>
                  <Form>
                    <Form.Check
                      type="switch"
                      checked={
                        shiftTypesData.active_duty == true ? true : false
                      }
                      id={'active_duty'}
                      label={'Aktive Schicht'}
                      onChange={(e) =>
                        e.target.checked
                          ? setShiftType({
                              ...shiftTypesData,
                              active_duty: 1,
                            })
                          : setShiftType({
                              ...shiftTypesData,
                              active_duty: 0,
                            })
                      }
                    />
                  </Form>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default CreateShiftType
