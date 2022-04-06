import React, { Fragment, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'

function UpdateShiftType() {
  const params = useParams()
  const history = useHistory()
  const [shiftTypeData, setShiftType] = useState({})

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/shift_types/${params.id}/`,
          {}
        )

        setShiftType(data.shift_type)
      } catch (error) {
        console.log(error.message)
      }
    }
    getData()
  }, [])

  async function submitFormHandler() {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/shift_types/${params.id}/`, {
        shiftTypeData,
      })
      history.push('/shift_types')
    } catch (error) {
      console.log(error.message)
    }
  }

  // Untkontrollierten Input kontrollieren
  if (Object.keys(shiftTypeData).length === 0) return <h1>...this loading</h1>

  // Kontrollierter Input (nachdem JS oben durch ist und qualificationsData aufgefüllt wurde)
  return (
    <Fragment>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Bearbeitung der Qualifikation</Card.Header>
              <Card.Body>
                <Card.Title>
                  ID: {shiftTypeData.id}
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

export default UpdateShiftType
