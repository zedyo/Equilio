import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { updateQualificationsData } from '../../../features/qualifications/qualificationSlice'

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
    return <h1>...this loading</h1>

  return (
    <>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Bearbeitung der Qualifikation</Card.Header>
              <Card.Body>
                <Card.Title>
                  ID: {qualificationData.id}
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
                </Card.Title>
                <Button
                  onClick={() =>
                    dispatch(updateQualificationsData(qualificationData))
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

export default UpdateQualification
