import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postWishesData } from '../../../../../../features/wishes/wishSlice'
import moment from 'moment'
import WishDatePicker from '../../../../dateSelector/WishDatePicker'

/**
 * Wunsch anlegen. Mitarbeiter:in ist fix aus dem Kontext (kein
 * erneutes Auswählen), Tag standardmäßig im aktuell betrachteten
 * Monat. Nach dem Speichern: Modal zu + onSaved (sauberes Refetch
 * statt setTimeout-Hack).
 */
function WishCreatorModal({
  employeeId,
  employeeName,
  defaultDate,
  show,
  onHide,
  onSaved,
}) {
  const dispatch = useDispatch()
  const { shiftsData } = useSelector((store) => store.shifts)

  const initialDate = () => {
    const now = moment()
    return {
      day: defaultDate?.day ?? Number(now.format('D')),
      month: defaultDate?.month ?? Number(now.format('M')),
      year: defaultDate?.year ?? Number(now.format('YYYY')),
    }
  }

  const [date, setDate] = useState(initialDate())
  const [shiftId, setShiftId] = useState('')
  const [busy, setBusy] = useState(false)

  // Bei (Neu-)Öffnen Kontext übernehmen.
  useEffect(() => {
    if (show) {
      setDate(initialDate())
      setShiftId('')
      setBusy(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, defaultDate?.day, defaultDate?.month, defaultDate?.year])

  const save = async () => {
    if (!shiftId) return
    setBusy(true)
    try {
      await dispatch(
        postWishesData({
          employee_id: employeeId,
          shift_id: Number(shiftId),
          day: Number(date.day),
          month: Number(date.month),
          year: Number(date.year),
        })
      )
      onSaved?.()
      onHide?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Neuer Dienstwunsch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {employeeName && (
          <div className="eq-wish-context mb-3">
            <span className="text-muted small">Für</span>
            <strong className="ms-2">{employeeName}</strong>
          </div>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Wunschtag</Form.Label>
          <WishDatePicker
            value={date}
            onChange={(d) => setDate({ ...date, ...d })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Wunschschicht</Form.Label>
          <Form.Select
            aria-label="Wunschschicht"
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
          >
            <option value="">-- Bitte auswählen --</option>
            {(shiftsData || []).map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.abrv}
                {shift.shift_type ? ` · ${shift.shift_type.name}` : ''}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={busy}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={save} disabled={!shiftId || busy}>
          {busy ? <Spinner animation="border" size="sm" /> : 'Speichern'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WishCreatorModal
