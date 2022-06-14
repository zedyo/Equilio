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
import { useDispatch } from 'react-redux'
import { postShiftsData } from '../../../features/shifts/shiftSlice'
import { FaCheck } from 'react-icons/fa'

function CreateShift() {
  const dispatch = useDispatch()

  const [shiftTypeData, setShiftType] = useState([])
  const [shiftsData, setShift] = useState({ color_hex: '#000000' })

  console.log(shiftsData)

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
                <Card.Title>
                  <InputGroup className="mb-6">
                    <InputGroup.Text id="shift_abrv">Abkürzung</InputGroup.Text>
                    <FormControl
                      placeholder="F1"
                      aria-label="Abkürzung"
                      aria-describedby="shift_abrv"
                      onChange={(event) =>
                        setShift({
                          ...shiftsData,
                          abrv: event.target.value,
                        })
                      }
                    />
                    <InputGroup.Text id="shift_abrv">Dauer</InputGroup.Text>
                    <FormControl
                      placeholder="8.0"
                      aria-label="Abkürzung"
                      aria-describedby="h_duration"
                      onChange={(event) =>
                        setShift({
                          ...shiftsData,
                          h_duration: event.target.value,
                        })
                      }
                    />
                    <FormSelect
                      aria-label="Floating label select example"
                      onChange={(e) =>
                        setShift({
                          ...shiftsData,
                          shift_type_id: parseInt(e.target.value),
                        })
                      }
                    >
                      <option key="0"> -- Schicht Art wählen --</option>
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
                      defaultValue="000000"
                      title="Choose your color"
                      onChange={(e) =>
                        setShift({
                          ...shiftsData,
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

export default CreateShift
