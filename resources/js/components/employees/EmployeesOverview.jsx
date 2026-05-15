import React from 'react'
import EmployeeColumn from './show/EmployeeColumn'
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Stack,
  Table,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'

function Employees() {
  const { employeesData } = useSelector((store) => store.employees)

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
          <Breadcrumb.Item active>Einstellungen: Team</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Team</div>
              <div className="ms-auto">
                <Button href={`/employee/create`} variant="outline-success">
                  <AiOutlinePlus /> Neues Teammitglied
                </Button>
              </div>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>Qualifikation</th>
                  <th>Einstellungsverhältnis</th>
                  <th>tgl. Arbeitszeit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employeesData.map((employee) => (
                  <EmployeeColumn key={employee.id} employeeData={employee} />
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Employees
