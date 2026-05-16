import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postPreferenceData } from '../../../../../features/preferences/preferenceSlice'
import './Preferences.scss'

const LEVELS = [
  { key: 'blocked', label: 'Gesperrt', hint: 'Wird nie verplant' },
  { key: 'valid', label: 'Erlaubt', hint: 'Darf verplant werden' },
  { key: 'preferred', label: 'Bevorzugt', hint: 'Wird bevorzugt verplant' },
]

function Preferences(props) {
  const dispatch = useDispatch()

  const { shiftsData } = useSelector((store) => store.shifts)
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)
  const { preferenceData } = useSelector((store) => store.preferences)

  const typeIdOf = (shift) =>
    shift.shift_type ? shift.shift_type.id : shift.shift_type_id

  const levelOf = (shiftId) => {
    const p = (preferenceData || []).find(
      (x) =>
        Number(x.employee_id) === Number(props.employeeId) &&
        Number(x.shift_id) === Number(shiftId)
    )
    return p ? p.level || 'preferred' : 'valid'
  }

  const setLevel = (shiftId, level) =>
    dispatch(
      postPreferenceData({
        employee_id: props.employeeId,
        shift_id: shiftId,
        level,
      })
    )

  if (!shiftTypesData || !shiftsData) {
    return <p className="text-muted">Lade Schichten …</p>
  }

  const activeTypes = shiftTypesData.filter(
    (t) =>
      t.active_duty == true &&
      shiftsData.some((s) => typeIdOf(s) === t.id)
  )

  if (activeTypes.length === 0) {
    return <p className="text-muted">Keine aktiven Schichten vorhanden.</p>
  }

  return (
    <div className="preferences">
      <p className="preferences__legend">
        Lege je Schicht fest, ob sie für diese Person{' '}
        <span className="preferences__chip is-blocked">gesperrt</span>,{' '}
        <span className="preferences__chip is-valid">erlaubt</span> oder{' '}
        <span className="preferences__chip is-preferred">bevorzugt</span> ist.
      </p>
      <Row>
        {activeTypes.map((shiftType) => (
          <Col key={shiftType.id} md={6}>
            <Card className="preferences__card">
              <Card.Body>
                <Card.Subtitle className="mb-3 text-muted">
                  {shiftType.name}
                </Card.Subtitle>
                {shiftsData
                  .filter((s) => typeIdOf(s) === shiftType.id)
                  .map((shift) => {
                    const current = levelOf(shift.id)
                    return (
                      <div className="preferences__row" key={shift.id}>
                        <span
                          className="preferences__shift"
                          style={{ color: shift.color_hex }}
                        >
                          {shift.abrv}
                        </span>
                        <div
                          className="preferences__seg"
                          role="group"
                          aria-label={`Präferenz für ${shift.abrv}`}
                        >
                          {LEVELS.map((lvl) => (
                            <button
                              type="button"
                              key={lvl.key}
                              title={lvl.hint}
                              aria-pressed={current === lvl.key}
                              className={[
                                'preferences__opt',
                                `is-${lvl.key}`,
                                current === lvl.key ? 'is-active' : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              onClick={() => setLevel(shift.id, lvl.key)}
                            >
                              {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Preferences
