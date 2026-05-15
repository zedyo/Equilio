import React from 'react'
import { Card, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteQualificationsData } from '../../../features/qualifications/qualificationSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'

function Qualification(props) {
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
            <Card.Title>{props.qualificationData.description}</Card.Title>
            <Button
              href={`/qualification/edit/${props.qualificationData.id}`}
              variant="outline-secondary"
              size="sm"
            >
              <FaRegEdit /> Bearbeiten
            </Button>{' '}
            <Button
              onClick={() =>
                dispatch(deleteQualificationsData(props.qualificationData.id))
              }
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

export default Qualification
