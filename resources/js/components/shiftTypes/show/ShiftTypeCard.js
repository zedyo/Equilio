import React from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'

function ShiftType(props) {
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
            <Card.Title>{props.shiftTypeData.name}</Card.Title>
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
