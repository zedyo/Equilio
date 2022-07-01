import React from 'react'
import { Button, Card, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
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
            <Card.Subtitle
              style={
                props.shiftTypeData.active_duty == 1
                  ? { color: 'blue', padding: '0 0 1rem 0' }
                  : { color: 'orange', padding: '0 0 1rem 0' }
              }
            >
              {props.shiftTypeData.active_duty == 1
                ? 'Aktive Schicht'
                : 'Passive Schicht'}
            </Card.Subtitle>
            {props.shiftTypeData.active_duty == 1 ? (
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  {`< ${props.shiftTypeData.min_occupation} : Unterbesetzung`}
                </ListGroupItem>
                <ListGroupItem>
                  {`> ${props.shiftTypeData.opt_occupation} : Überbesetzung`}
                </ListGroupItem>
              </ListGroup>
            ) : (
              <div style={{ height: '5.3rem' }} />
            )}
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
