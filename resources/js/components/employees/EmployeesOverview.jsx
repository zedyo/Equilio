import React from 'react'
import EmployeeColumn from './show/EmployeeColumn'
import { Button, Card, Container, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiUsers } from 'react-icons/fi'
import PageHeader from '../shared/PageHeader'
import EmptyState from '../shared/EmptyState'

function Employees() {
  const { employeesData } = useSelector((store) => store.employees)

  return (
    <Container className="pb-5">
      <PageHeader
        title="Team"
        description="Mitarbeiter:innen, Qualifikation und Beschäftigungsumfang verwalten."
        actions={
          <Button href="/employee/create" variant="primary">
            <AiOutlinePlus className="me-1" /> Neues Teammitglied
          </Button>
        }
        chips={[
          { label: `${employeesData.length} Mitglieder`, tone: 'brand' },
        ]}
      />

      <Card>
        <Card.Body className="p-0">
          {employeesData.length === 0 ? (
            <EmptyState
              icon={<FiUsers />}
              title="Noch keine Teammitglieder"
              description="Lege das erste Teammitglied an, um mit der Planung zu beginnen."
              action={
                <Button href="/employee/create" variant="primary">
                  <AiOutlinePlus className="me-1" /> Neues Teammitglied
                </Button>
              }
            />
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>Qualifikation</th>
                  <th>Anstellung</th>
                  <th>tgl. Arbeitszeit</th>
                  <th className="text-end">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {employeesData.map((employee) => (
                  <EmployeeColumn key={employee.id} employeeData={employee} />
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Employees
