import React, { useState } from 'react'
import {
  Button,
  Card,
  Container,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { postShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'

function CreateShiftType() {
  const dispatch = useDispatch()

  const [shiftTypesData, setShiftType] = useState({})
  console.log(shiftTypesData)

  return (
    <>
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>Anlegen einer Schicht Art</Card.Header>
              <Card.Body>
                <Card.Title>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="shift_type_name">
                      Bezeichnung
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Sonstige Schicht"
                      aria-label="Bezeichnung"
                      aria-describedby="shift_type_name"
                      onChange={(event) =>
                        setShiftType({
                          ...shiftTypesData,
                          name: event.target.value,
                        })
                      }
                    />
                  </InputGroup>
                </Card.Title>
                <Button
                  onClick={() => dispatch(postShiftTypesData(shiftTypesData))}
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

export default CreateShiftType
