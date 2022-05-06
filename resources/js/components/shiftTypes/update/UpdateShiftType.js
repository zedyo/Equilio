import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'

function UpdateShiftType() {
  const params = useParams()
  const dispatch = useDispatch()
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)
  const shiftType = shiftTypesData.find(
    (shiftType) => shiftType.id == params.id
  )

  const [shiftTypeData, setShiftType] = useState({})

  useEffect(() => {
    shiftType !== undefined && setShiftType(shiftType)
  }, [shiftType])

  if (Object.keys(shiftTypeData).length === 0) return <h1>...this loading</h1>

  return (
    <>
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
                <Button
                  onClick={() => dispatch(updateShiftTypesData(shiftTypeData))}
                  variant="outline-success"
                  href={`/shift_types`}
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

export default UpdateShiftType
