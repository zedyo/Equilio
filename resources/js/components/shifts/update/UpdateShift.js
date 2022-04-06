import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  FormSelect,
} from 'react-bootstrap'

function UpdateShift() {
  const params = useParams()
  const history = useHistory()
  const [shiftTypeData, setShiftType] = useState([])
  const [shiftData, setShift] = useState({})

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/shifts/${params.id}/`,
          {}
        )
        setShift(data.shift)
      } catch (error) {
        console.log(error.message)
      }
    }
    getData()
  }, [])

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
      await axios.patch(`http://127.0.0.1:8000/api/shifts/${params.id}/`, {
        shiftData,
      })
      history.push('/shifts')
    } catch (error) {
      console.log(error.message)
    }
  }

  if (Object.keys(shiftData).length === 0) return <h1>...this loading</h1>

  return (
    <Fragment>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Bearbeitung der Schicht</Card.Header>
              <Card.Body>
                <Card.Title>
                  ID: {shiftData.id}
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

export default UpdateShift
