import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
  Stack,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { updateQualificationsData } from '../../../features/qualifications/qualificationSlice'
import { FaCheck } from 'react-icons/fa'
import { FiChevronLeft } from 'react-icons/fi'

function UpdateQualification() {
  const params = useParams()
  const dispatch = useDispatch()
  const { qualificationsData } = useSelector((store) => store.qualifications)
  const qualification = qualificationsData.find(
    (qualification) => qualification.id == params.id
  )

  const [qualificationData, setQualification] = useState({})

  useEffect(() => {
    qualification !== undefined && setQualification(qualification)
  }, [qualification])

  if (Object.keys(qualificationData).length === 0)
    return <Container className="py-4 text-muted">Lädt …</Container>

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
                  <div>Daten Bearbeitung</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() =>
                        dispatch(updateQualificationsData(qualificationData))
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
                      value={qualificationData.description}
                      onChange={(e) =>
                        setQualification({
                          ...qualificationData,
                          description: e.target.value,
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

export default UpdateQualification
