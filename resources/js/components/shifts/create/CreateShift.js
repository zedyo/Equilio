import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Container,
  FormControl,
  FormSelect,
  InputGroup,
  Stack,
  Breadcrumb,
  Row,
  Col,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { postShiftsData } from '../../../features/shifts/shiftSlice'
import { FaCheck } from 'react-icons/fa'
import style from '../../dutyOverview/employeeRow/dutyCell/DutyCell.scss'

function CreateShift() {
  const dispatch = useDispatch()

  const [shiftTypeData, setShiftType] = useState([])
  const [shiftsData, setShift] = useState({ color_hex: '#000000' })

  useEffect(() => {
    async function getShiftTypeData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/shift_types`
        )
        setShiftType(data.shift_types)
      } catch (error) {
        console.log(error.message)
      }
    }
    getShiftTypeData()
  }, [])

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
          <Breadcrumb.Item href="/shifts">
            Einstellungen: Schichten
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Neue Schicht</Breadcrumb.Item>
        </Breadcrumb>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Stack direction="horizontal" gap={3}>
                  <div>Neue Schicht</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() => dispatch(postShiftsData(shiftsData))}
                      variant="outline-primary"
                      href={`/shifts`}
                    >
                      <FaCheck /> Speichern
                    </Button>
                  </div>
                </Stack>
              </Card.Header>

              <Card.Body>
                <Container>
                  <Row>
                    <Col xs>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="qualification_description">
                          Schichtart
                        </InputGroup.Text>
                        <FormSelect
                          aria-label="Floating label select example"
                          onChange={(e) =>
                            setShift({
                              ...shiftsData,
                              shift_type_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <option key="0">Bitte auswählen</option>
                          {shiftTypeData.map((shiftTypeObject) => (
                            <option
                              key={shiftTypeObject.id}
                              value={shiftTypeObject.id}
                            >
                              {shiftTypeObject.name}
                            </option>
                          ))}
                        </FormSelect>
                      </InputGroup>
                    </Col>

                    <Col xs lg="2">
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="qualification_description">
                          Abkürzung
                        </InputGroup.Text>
                        <FormControl
                          placeholder="X1"
                          aria-label="Abkürzung"
                          aria-describedby="shift_abrv"
                          onChange={(e) =>
                            setShift({
                              ...shiftsData,
                              abrv: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>

                    <Col xs lg="2">
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="shift_abrv">
                          Dauer (Std.)
                        </InputGroup.Text>
                        <FormControl
                          placeholder="24.0"
                          aria-label="Abkürzung"
                          aria-describedby="h_duration"
                          onChange={(event) =>
                            setShift({
                              ...shiftsData,
                              h_duration: event.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>

                    <Col xs lg="2">
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="shift_abrv">Farbe</InputGroup.Text>
                        <FormControl
                          type="color"
                          id="exampleColorInput"
                          title="Choose your color"
                          onChange={(e) =>
                            setShift({
                              ...shiftsData,
                              color_hex: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>

                    {shiftsData.abrv &&
                      shiftsData.shift_type_id &&
                      (shiftTypeData.find(
                        (data) => data.id == shiftsData.shift_type_id
                      )?.active_duty == 0 ? (
                        <Col xs lg="2">
                          Vorschau
                          <input
                            style={{
                              marginTop: '0.2rem',
                              marginLeft: '0.8rem',
                              color: shiftsData.color_hex,
                            }}
                            className={'passiveDuty'}
                            value={shiftsData.abrv}
                          />
                        </Col>
                      ) : (
                        <Col xs lg="2">
                          Vorschau
                          <input
                            style={{
                              marginTop: '0.2rem',
                              marginLeft: '0.8rem',
                              color: shiftsData.color_hex,
                            }}
                            className={'inputDutyForm'}
                            value={shiftsData.abrv}
                          />
                          <input
                            style={{
                              marginLeft: '0.3rem',
                              color: shiftsData.color_hex,
                            }}
                            className={'preferenceInjury'}
                            value={shiftsData.abrv}
                          />
                          <input
                            style={{
                              marginLeft: '0.3rem',
                              color: shiftsData.color_hex,
                            }}
                            className={'wishInjury'}
                            value={shiftsData.abrv}
                          />
                        </Col>
                      ))}
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CreateShift
