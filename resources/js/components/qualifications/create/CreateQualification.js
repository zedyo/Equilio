import React, { useState } from 'react'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  Stack,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { postQualificationsData } from '../../../features/qualifications/qualificationSlice'
import { FaCheck } from 'react-icons/fa'

function CreateQualification() {
  const dispatch = useDispatch()
  const [qualificationsData, setQualification] = useState({})

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Stack direction="horizontal" gap={3}>
                  <div>Neue Qualifikation</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() =>
                        dispatch(postQualificationsData(qualificationsData))
                      }
                      variant="outline-primary"
                      href={`/qualifications`}
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
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CreateQualification
