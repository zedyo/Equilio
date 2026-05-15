import React from 'react'
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Stack,
  Table,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaRegTrashAlt } from 'react-icons/fa'
import { deleteAbsenceData } from '../../features/absences/absenceSlice'

export const ABSENCE_TYPE_LABELS = {
  vacation: 'Urlaub',
  sick: 'Krankheit',
  training: 'Fortbildung',
  other: 'Sonstiges',
}

function AbsencesOverview() {
  const dispatch = useDispatch()
  const { absenceData } = useSelector((store) => store.absences)

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
        <Breadcrumb.Item active>Einstellungen: Abwesenheiten</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header>
          <Stack direction="horizontal" gap={3}>
            <div>Abwesenheiten (Urlaub / Krankheit / Fortbildung)</div>
            <div className="ms-auto">
              <Button href="/absence/create" variant="outline-success">
                <AiOutlinePlus /> Neue Abwesenheit
              </Button>
            </div>
          </Stack>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Mitarbeiter</th>
                <th>Art</th>
                <th>Von</th>
                <th>Bis</th>
                <th>Notiz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {absenceData.map((absence) => (
                <tr key={absence.id}>
                  <td>
                    {absence.employee
                      ? `${absence.employee.first_name} ${absence.employee.last_name}`
                      : `#${absence.employee_id}`}
                  </td>
                  <td>
                    {ABSENCE_TYPE_LABELS[absence.type] ?? absence.type}
                  </td>
                  <td>{absence.start_date}</td>
                  <td>{absence.end_date}</td>
                  <td>{absence.note}</td>
                  <td>
                    <Button
                      onClick={() =>
                        dispatch(deleteAbsenceData(absence.id))
                      }
                      variant="outline-danger"
                      size="sm"
                    >
                      <FaRegTrashAlt /> Löschen
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AbsencesOverview
