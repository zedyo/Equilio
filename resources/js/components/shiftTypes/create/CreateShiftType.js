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
import { postShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaCheck } from 'react-icons/fa'

function CreateShiftType() {
  const dispatch = useDispatch()

  const [shiftTypesData, setShiftType] = useState({})
  console.log(shiftTypesData)

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <Card>
              <Card.Header>
                <Stack direction="horizontal" gap={3}>
                  <div>Neue Schichtart</div>
                  <div className="ms-auto">
                    <Button
                      onClick={() =>
                        dispatch(postShiftTypesData(shiftTypesData))
                      }
                      variant="outline-success"
                      href={`/shift_types`}
                    >
                      <FaCheck /> Speichern
                    </Button>
                  </div>
                </Stack>
              </Card.Header>
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
                </Card.Title>{' '}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}

export default CreateShiftType
