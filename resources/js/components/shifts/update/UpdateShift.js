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
  Row,
  Col,
  Breadcrumb,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateShiftsData } from '../../../features/shifts/shiftSlice'
import { FaCheck } from 'react-icons/fa'
import style from '../../dutyOverview/employeeRow/dutyCell/DutyCell.scss'

function UpdateShift() {
  const params = useParams()
  const dispatch = useDispatch()
  const { shiftsData } = useSelector((store) => store.shifts)
  const shift = shiftsData.find((shift) => shift.id == params.id)

  const [shiftTypeData, setShiftType] = useState([])
  const [shiftData, setShift] = useState({})

  useEffect(() => {
    shift !== undefined && setShift(shift)
  }, [shift])

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

  if (Object.keys(shiftData).length === 0) return <h1></h1>
  console.log(shiftData.shift_type.active_duty)

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
          <Breadcrumb.Item href="/shifts">
            Einstellungen: Schichten
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Daten Bearbeitung</Breadcrumb.Item>
        </Breadcrumb>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Stack direction="horizontal" gap={3}>
                  <div>Daten Bearbeitung</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() => dispatch(updateShiftsData(shiftData))}
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
                              ...shiftData,
                              shift_type_id: parseInt(e.target.value),
                            })
                          }
                          defaultValue={shiftData.shift_type_id}
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
                          value={shiftData.abrv}
                          onChange={(e) =>
                            setShift({
                              ...shiftData,
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
                          placeholder="8.0"
                          aria-label="Abkürzung"
                          aria-describedby="h_duration"
                          value={shiftData.h_duration}
                          onChange={(event) =>
                            setShift({
                              ...shiftData,
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
                          defaultValue={shiftData.color_hex}
                          title="Choose your color"
                          onChange={(e) =>
                            setShift({
                              ...shiftData,
                              color_hex: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Col>

                    {shiftData.abrv &&
                      shiftData.shift_type_id &&
                      (shiftTypeData.find(
                        (data) => data.id == shiftData.shift_type_id
                      )?.active_duty == 0 ? (
                        <Col xs lg="2">
                          Vorschau
                          <input
                            style={{
                              marginTop: '0.2rem',
                              marginLeft: '0.8rem',
                              color: shiftData.color_hex,
                            }}
                            className={'passiveDuty'}
                            value={shiftData.abrv}
                          />
                        </Col>
                      ) : (
                        <Col xs lg="2">
                          Vorschau
                          <input
                            style={{
                              marginTop: '0.2rem',
                              marginLeft: '0.8rem',
                              color: shiftData.color_hex,
                            }}
                            className={'inputDutyForm'}
                            value={shiftData.abrv}
                          />
                          <input
                            style={{
                              marginLeft: '0.3rem',
                              color: shiftData.color_hex,
                            }}
                            className={'preferenceInjury'}
                            value={shiftData.abrv}
                          />
                          <input
                            style={{
                              marginLeft: '0.3rem',
                              color: shiftData.color_hex,
                            }}
                            className={'wishInjury'}
                            value={shiftData.abrv}
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

export default UpdateShift
