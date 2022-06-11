import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'

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
              <FaRegEdit />
            </Button>{' '}
            <Button
              onClick={() =>
                dispatch(deleteShiftTypesData(props.shiftTypeData.id))
              }
              variant="outline-danger"
              size="sm"
            >
              <FaRegTrashAlt />
            </Button>{' '}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default ShiftType
