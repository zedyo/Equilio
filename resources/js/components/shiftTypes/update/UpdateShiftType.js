import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaCheck } from 'react-icons/fa'

function UpdateShiftType() {
  const params = useParams()
  const dispatch = useDispatch()
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)
  const shiftType = shiftTypesData.find(
    (shiftType) => shiftType.id == params.id
  )

  const [shiftTypeData, setShiftType] = useState({})

  useEffect(() => {
    shiftType !== undefined && setShiftType(shiftType)
  }, [shiftType])

  if (Object.keys(shiftTypeData).length === 0) return <h1>...this loading</h1>

  console.log(shiftTypeData)
  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Schichtart bearbeiten</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(updateShiftTypesData(shiftTypeData))}
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
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="shift_type_name">
                      Bezeichnung
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Berufsbeziechnung"
                      aria-label="Bezeichnung"
                      aria-describedby="shift_type_name"
                      value={shiftTypeData.name}
                      onChange={(e) =>
                        setShiftType({
                          ...shiftTypeData,
                          name: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Col>

                {shiftTypeData.active_duty == true && (
                  <Col xs lg="3">
                    <InputGroup>
                      <InputGroup.Text id="shift_type_name">
                        Mindestbesetzung unter
                      </InputGroup.Text>
                      <FormControl
                        placeholder="Berufsbeziechnung"
                        aria-label="Bezeichnung"
                        aria-describedby="shift_type_name"
                        value={shiftTypeData.min_occupation}
                        onChange={(e) =>
                          setShiftType({
                            ...shiftTypeData,
                            min_occupation: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Col>
                )}

                {shiftTypeData.active_duty == true && (
                  <Col xs lg="3">
                    <InputGroup>
                      <InputGroup.Text id="shift_type_name">
                        Überbesetzung
                      </InputGroup.Text>
                      <FormControl
                        placeholder="Berufsbeziechnung"
                        aria-label="Bezeichnung"
                        aria-describedby="shift_type_name"
                        value={shiftTypeData.opt_occupation}
                        onChange={(e) =>
                          setShiftType({
                            ...shiftTypeData,
                            opt_occupation: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Col>
                )}

                <Col xs lg="2" style={{ margin: '0.3rem 0' }}>
                  <Form>
                    <Form.Check
                      type="switch"
                      checked={shiftTypeData.active_duty == true ? true : false}
                      id={'active_duty'}
                      label={'Aktive Schicht'}
                      onChange={(e) =>
                        e.target.checked
                          ? setShiftType({
                              ...shiftTypeData,
                              active_duty: 1,
                            })
                          : setShiftType({
                              ...shiftTypeData,
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

export default UpdateShiftType
