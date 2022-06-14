import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Stack,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaCheck } from 'react-icons/fa'

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
      <Container style={{ padding: '2rem 0' }}>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Schichtart bearbeiten</div>
              <div className="ms-auto">
                <Button
                  onClick={() => dispatch(updateShiftTypesData(shiftTypeData))}
                  variant="outline-success"
                  href={`/shift_types`}
                >
                  <FaCheck /> Speichern
                </Button>
              </div>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Container>
              <Row></Row>
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
              <Form>
                <Form.Check type="radio">
                  <Form.Check type="radio" isValid />
                  <Form.Check.Label>{`Aktive Schicht`}</Form.Check.Label>
                  <Form.Control.Feedback type="valid">
                    Aktive Schichten können Präferenziert werden und zählen in
                    der Statistik
                  </Form.Control.Feedback>
                </Form.Check>
                <Form.Check type="radio">
                  <Form.Check type="radio" isValid />
                  <Form.Check.Label>{`Passive Schicht`}</Form.Check.Label>
                  <Form.Control.Feedback type="valid">
                    Passive Schichten sind immer präferiert und kommen nicht in
                    der Statistik vor
                  </Form.Control.Feedback>
                </Form.Check>
              </Form>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default UpdateShiftType
