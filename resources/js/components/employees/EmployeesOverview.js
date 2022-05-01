import React from 'react'
import EmployeeColumn from './show/EmployeeColumn'
import { Button, Card, Container, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'

function Employees() {
  const { employeesData } = useSelector((store) => store.employees)

  return (
    <>
      <Container>
        <Card>
          <Card.Header>Angestellten Übersicht</Card.Header>
          <Card.Body>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>Qualifikation</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {employeesData.map((employee) => (
                  <EmployeeColumn key={employee.id} employeeData={employee} />
                ))}
              </tbody>
            </Table>
            <Container fluid="sm">
              <Button href={`/employee/create`} variant="outline-success">
                Erstellen
              </Button>{' '}
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Employees
