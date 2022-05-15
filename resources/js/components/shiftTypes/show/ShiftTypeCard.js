import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'

function ShiftType(props) {
  const dispatch = useDispatch()

  return (
    <>
      <Col md="auto">
        <Card style={{ width: '18rem', margin: '0.3rem' }}>
          <Card.Body>
            <Card.Title>{props.shiftTypeData.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              ID: {props.shiftTypeData.id}
            </Card.Subtitle>
            <Button
              href={`/shift_type/edit/${props.shiftTypeData.id}`}
              variant="outline-secondary"
              size="sm"
            >
              Bearbeiten
            </Button>{' '}
            <Button
              onClick={() =>
                dispatch(deleteShiftTypesData(props.shiftTypeData.id))
              }
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

export default ShiftType
