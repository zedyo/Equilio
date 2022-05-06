import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftsData } from '../../../features/shifts/shiftSlice'

function Shift(props) {
  const dispatch = useDispatch()

  return (
    <>
      <Col md="auto">
        <Card style={{ width: '18rem', margin: '0.3rem' }}>
          <Card.Body>
            <Card.Title style={{ color: `${props.shiftsData.color_hex}` }}>
              {props.shiftsData.abrv}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              ID: {props.shiftsData.id}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Tägliche Arbeitszeit: {props.shiftsData.h_duration}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Schicht Typ: {props.shiftsData.shift_type.name}
            </Card.Subtitle>
            <Button
              href={`/shift/edit/${props.shiftsData.id}`}
              variant="outline-secondary"
              size="sm"
            >
              Bearbeiten
            </Button>{' '}
            <Button
              onClick={() => dispatch(deleteShiftsData(props.shiftsData.id))}
              variant="outline-danger"
              size="sm"
            >
              Löschen
            </Button>{' '}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default Shift
