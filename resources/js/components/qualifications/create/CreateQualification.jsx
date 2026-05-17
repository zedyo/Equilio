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
import { FiChevronLeft } from 'react-icons/fi'

function CreateQualification() {
  const dispatch = useDispatch()
  const [qualificationsData, setQualification] = useState({})

  return (
    <>
      <Container className="py-4">
        <a href="/qualifications" className="eq-page-header__back">
          <FiChevronLeft /> Qualifikationen
        </a>
        <div className="row justify-content-center mt-2">
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
                      variant="primary"
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
