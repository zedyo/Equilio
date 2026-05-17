import React, { useState } from 'react'
import { Button, Card, Container, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiCalendar } from 'react-icons/fi'
import { deleteAbsenceData } from '../../features/absences/absenceSlice'
import PageHeader from '../shared/PageHeader'
import EmptyState from '../shared/EmptyState'
import ConfirmDialog from '../shared/ConfirmDialog'

export const ABSENCE_TYPE_LABELS = {
  vacation: 'Urlaub',
  sick: 'Krankheit',
  training: 'Fortbildung',
  other: 'Sonstiges',
}

function AbsencesOverview() {
  const dispatch = useDispatch()
  const { absenceData } = useSelector((store) => store.absences)
  const [toDelete, setToDelete] = useState(null)

  const employeeName = (a) =>
    a.employee
      ? `${a.employee.first_name} ${a.employee.last_name}`
      : `#${a.employee_id}`

  return (
    <Container className="pb-5">
      <PageHeader
        title="Abwesenheiten"
        description="Urlaub, Krankheit und Fortbildung – Grundlage für das erschwerte Planungsszenario."
        actions={
          <Button href="/absence/create" variant="primary">
            <AiOutlinePlus className="me-1" /> Neue Abwesenheit
          </Button>
        }
        chips={[{ label: `${absenceData.length} Einträge`, tone: 'brand' }]}
      />

      <Card>
        <Card.Body className="p-0">
          {absenceData.length === 0 ? (
            <EmptyState
              icon={<FiCalendar />}
              title="Keine Abwesenheiten"
              description="Trage Urlaub, Krankheit oder Fortbildung ein, damit die Planung sie berücksichtigt."
              action={
                <Button href="/absence/create" variant="primary">
                  <AiOutlinePlus className="me-1" /> Neue Abwesenheit
                </Button>
              }
            />
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Mitarbeiter</th>
                  <th>Art</th>
                  <th>Von</th>
                  <th>Bis</th>
                  <th>Notiz</th>
                  <th className="text-end">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {absenceData.map((absence) => (
                  <tr key={absence.id}>
                    <td>{employeeName(absence)}</td>
                    <td>
                      {ABSENCE_TYPE_LABELS[absence.type] ?? absence.type}
                    </td>
                    <td>{absence.start_date}</td>
                    <td>{absence.end_date}</td>
                    <td>{absence.note}</td>
                    <td className="text-end">
                      <Button
                        onClick={() => setToDelete(absence)}
                        variant="outline-danger"
                        size="sm"
                        aria-label="Abwesenheit löschen"
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!toDelete}
        title="Abwesenheit löschen?"
        body={
          toDelete && (
            <>
              Abwesenheit von <strong>{employeeName(toDelete)}</strong> (
              {ABSENCE_TYPE_LABELS[toDelete.type] ?? toDelete.type}) wird
              entfernt.
            </>
          )
        }
        onConfirm={() => {
          dispatch(deleteAbsenceData(toDelete.id))
          setToDelete(null)
        }}
        onCancel={() => setToDelete(null)}
      />
    </Container>
  )
}

export default AbsencesOverview
