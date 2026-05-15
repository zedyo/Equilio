import React from 'react'
import { Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { postPreferenceData } from '../../../../../features/preferences/preferenceSlice'

function Preferences(props) {
  const dispatch = useDispatch()

  const { shiftsData } = useSelector((store) => store.shifts)
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)
  const { preferenceData } = useSelector((store) => store.preferences)

  return (
    <>
      <Row>
        {shiftTypesData !== undefined &&
          shiftTypesData
            .filter(
              (shiftType) =>
                shiftType.active_duty == true &&
                shiftsData.filter(
                  (shift) => shift.shift_type.id === shiftType.id
                ).length > 0
            )
            .map((shiftType) => (
              <Col key={shiftType.id} md={6}>
                <Card
                  style={{
                    margin: '0.8rem 0',
                  }}
                >
                  <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">
                      {shiftType.name}
                    </Card.Subtitle>
                    <Form key={shiftType.id}>
                      {shiftsData !== undefined &&
                        shiftsData
                          .filter(
                            (shift) => shift.shift_type.id === shiftType.id
                          )
                          .map((shift) => (
                            <Form.Check
                              checked={
                                preferenceData.find(
                                  (preference) =>
                                    preference.employee_id ==
                                      props.employeeId &&
                                    preference.shift_id == shift.id
                                )
                                  ? true
                                  : false
                              }
                              type="switch"
                              id={shift.id}
                              label={shift.abrv}
                              key={shift.id}
                              onChange={(e) =>
                                e.target.checked
                                  ? dispatch(
                                      postPreferenceData({
                                        employee_id: props.employeeId,
                                        shift_id: shift.id,
                                        active: 1,
                                      })
                                    )
                                  : dispatch(
                                      postPreferenceData({
                                        employee_id: props.employeeId,
                                        shift_id: shift.id,
                                        active: 0,
                                      })
                                    )
                              }
                            />
                          ))}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            ))}
      </Row>
    </>
  )
}

export default Preferences
