import React, { useState } from 'react'
import { Card, Col, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteQualificationsData } from '../../../features/qualifications/qualificationSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import ConfirmDialog from '../../shared/ConfirmDialog'

function Qualification(props) {
  const dispatch = useDispatch()
  const [confirm, setConfirm] = useState(false)
  const q = props.qualificationData

  return (
    <Col md={4} className="mb-3">
      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mb-3">{q.description}</Card.Title>
          <div className="mt-auto d-flex gap-2">
            <Button
              href={`/qualification/edit/${q.id}`}
              variant="outline-primary"
              size="sm"
            >
              <FaRegEdit /> Bearbeiten
            </Button>
            <Button
              onClick={() => setConfirm(true)}
              variant="outline-danger"
              size="sm"
              aria-label={`${q.description} löschen`}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={confirm}
        title="Qualifikation löschen?"
        body={
          <>
            <strong>{q.description}</strong> wird entfernt.
          </>
        }
        onConfirm={() => {
          dispatch(deleteQualificationsData(q.id))
          setConfirm(false)
        }}
        onCancel={() => setConfirm(false)}
      />
    </Col>
  )
}

export default Qualification
