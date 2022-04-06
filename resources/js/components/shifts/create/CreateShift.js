import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  FormSelect,
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function CreateShift() {
  const history = useHistory()
  const [shiftTypeData, setShiftType] = useState([])
  const [shiftData, setShift] = useState({})

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

  async function submitFormHandler() {
    try {
      await axios.post(`http://127.0.0.1:8000/api/shifts/`, {
        shiftData,
      })
      history.push('/shifts')
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Fragment>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Anlegen einer Schicht</Card.Header>
              <Card.Body>
                <Card.Title>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="shift_abrv">Abkürzung</InputGroup.Text>
                    <FormControl
                      placeholder="F1"
                      aria-label="Abkürzung"
                      aria-describedby="shift_abrv"
                      onChange={(event) =>
                        setShift({
                          ...shiftData,
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
                    >
                      <option key="0">Bitte Schicht Art auswählen</option>
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
                          ...shiftData,
                          color_hex: e.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Card.Title>
                <Button onClick={submitFormHandler} variant="outline-success">
                  Speichern
                </Button>{' '}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </Fragment>
  )
}

export default CreateShift
