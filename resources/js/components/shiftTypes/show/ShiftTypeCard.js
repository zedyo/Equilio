import React from 'react'
import { Fragment } from 'react'
import { Card, Col, Button } from 'react-bootstrap'

function ShiftType(props) {
  return (
    <Fragment>
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
              onClick={() => props.deleteHandler(props.shiftTypeData.id)}
              variant="outline-danger"
              size="sm"
            >
              Löschen
            </Button>{' '}
          </Card.Body>
        </Card>
      </Col>
    </Fragment>
  )
}

export default ShiftType
