import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftsData } from '../../../features/shifts/shiftSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'

function Shift(props) {
  const dispatch = useDispatch()

  return (
    <>
      <Col md={4}>
        <Card
          style={{
            margin: '0.8rem 0',
          }}
        >
          <Card.Body>
            <Card.Title style={{ color: `${props.shiftsData.color_hex}` }}>
              {props.shiftsData.abrv}
            </Card.Title>
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
              <FaRegEdit /> Bearbeiten
            </Button>{' '}
            <Button
              onClick={() => dispatch(deleteShiftsData(props.shiftsData.id))}
              variant="outline-danger"
              size="sm"
            >
              <FaRegTrashAlt /> Löschen
            </Button>{' '}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default Shift
