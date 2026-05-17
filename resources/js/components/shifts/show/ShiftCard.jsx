import React, { useState } from 'react'
import { Button, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftsData } from '../../../features/shifts/shiftSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import ConfirmDialog from '../../shared/ConfirmDialog'

function Shift(props) {
  const dispatch = useDispatch()
  const [confirm, setConfirm] = useState(false)
  const s = props.shiftsData

  return (
    <Col md={4} className="mb-3">
      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title style={{ color: s.color_hex }}>{s.abrv}</Card.Title>
          <Card.Subtitle className="mb-1 text-muted">
            Dauer: {s.h_duration} h
          </Card.Subtitle>
          <Card.Subtitle className="mb-3 text-muted">
            Schichtart: {s.shift_type ? s.shift_type.name : '–'}
          </Card.Subtitle>
          <div className="mt-auto d-flex gap-2">
            <Button
              href={`/shift/edit/${s.id}`}
              variant="outline-primary"
              size="sm"
            >
              <FaRegEdit /> Bearbeiten
            </Button>
            <Button
              onClick={() => setConfirm(true)}
              variant="outline-danger"
              size="sm"
              aria-label={`Schicht ${s.abrv} löschen`}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={confirm}
        title="Schicht löschen?"
        body={
          <>
            Die Schicht <strong>{s.abrv}</strong> wird entfernt.
          </>
        }
        onConfirm={() => {
          dispatch(deleteShiftsData(s.id))
          setConfirm(false)
        }}
        onCancel={() => setConfirm(false)}
      />
    </Col>
  )
}

export default Shift
