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
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateShiftsData } from '../../../features/shifts/shiftSlice'
import { FaCheck } from 'react-icons/fa'

function UpdateShift() {
  const params = useParams()
  const dispatch = useDispatch()
  const { shiftsData } = useSelector((store) => store.shifts)
  const shift = shiftsData.find((shift) => shift.id == params.id)

  const [shiftTypeData, setShiftType] = useState([])
  const [shiftData, setShift] = useState({})
  console.log(shiftData)

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

  if (Object.keys(shiftData).length === 0) return <h1>...this loading</h1>

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Stack direction="horizontal" gap={3}>
                  <div>Schicht bearbeiten</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() => dispatch(updateShiftsData(shiftData))}
                      variant="outline-success"
                      href={`/shifts`}
                    >
                      <FaCheck /> Speichern
                    </Button>
                  </div>
                </Stack>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="qualification_description">
                      Abkürzung
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Abkürzung"
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
                    <InputGroup.Text id="shift_abrv">Dauer</InputGroup.Text>
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
                </Card.Title>{' '}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

export default UpdateShift
