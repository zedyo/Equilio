import React, { useState } from 'react'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { postQualificationsData } from '../../../features/qualifications/qualificationSlice'

function CreateQualification() {
  const dispatch = useDispatch()
  const [qualificationsData, setQualification] = useState({})

  return (
    <>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Anlegen einer Qualifikation</Card.Header>
              <Card.Body>
                <Card.Title>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="qualification_description">
                      Bezeichnung
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Berufsbeziechnung"
                      aria-label="Bezeichnung"
                      aria-describedby="qualification_description"
                      onChange={(event) =>
                        setQualification({
                          ...qualificationsData,
                          description: event.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Card.Title>
                <Button
                  onClick={() =>
                    dispatch(postQualificationsData(qualificationsData))
                  }
                  variant="outline-success"
                  href={`/qualifications`}
                >
                  Speichern
                </Button>{' '}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CreateQualification
