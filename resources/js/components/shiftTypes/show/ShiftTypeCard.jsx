import React, { useState } from 'react'
import { Button, Card, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteShiftTypesData } from '../../../features/shiftTypes/shiftTypeSlice'
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa'
import ConfirmDialog from '../../shared/ConfirmDialog'

function ShiftType(props) {
  const dispatch = useDispatch()
  const [confirm, setConfirm] = useState(false)
  const t = props.shiftTypeData
  const active = t.active_duty == 1

  return (
    <Col md={4} className="mb-3">
      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title>{t.name}</Card.Title>
          <span
            className={`eq-chip eq-chip--${active ? 'brand' : 'warning'} mb-3`}
            style={{ alignSelf: 'flex-start' }}
          >
            {active ? 'Aktive Schicht' : 'Passive Schicht'}
          </span>
          {active && (
            <ListGroup className="list-group-flush mb-3">
              <ListGroupItem className="px-0">
                {`< ${t.min_occupation} : Unterbesetzung`}
              </ListGroupItem>
              <ListGroupItem className="px-0">
                {`> ${t.opt_occupation} : Überbesetzung`}
              </ListGroupItem>
            </ListGroup>
          )}
          <div className="mt-auto d-flex gap-2">
            <Button
              href={`/shift_type/edit/${t.id}`}
              variant="outline-primary"
              size="sm"
            >
              <FaRegEdit /> Bearbeiten
            </Button>
            <Button
              onClick={() => setConfirm(true)}
              variant="outline-danger"
              size="sm"
              aria-label={`Schichtart ${t.name} löschen`}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={confirm}
        title="Schichtart löschen?"
        body={
          <>
            Die Schichtart <strong>{t.name}</strong> wird entfernt.
          </>
        }
        onConfirm={() => {
          dispatch(deleteShiftTypesData(t.id))
          setConfirm(false)
        }}
        onCancel={() => setConfirm(false)}
      />
    </Col>
  )
}

export default ShiftType
