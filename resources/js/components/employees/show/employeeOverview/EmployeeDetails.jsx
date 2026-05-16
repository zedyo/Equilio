import React, { useState, useEffect } from 'react'
import { Col, Row, Container, Card, Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Preferences from './preferences/Preferences'
import WishColumn from './wishColumn/WishColumn'
import { FaUserEdit } from 'react-icons/fa'
import PageHeader from '../../../shared/PageHeader'
import EmptyState from '../../../shared/EmptyState'

function DataItem({ label, value }) {
  return (
    <div className="eq-data-item">
      <div className="eq-data-item__label">{label}</div>
      <div className="eq-data-item__value">{value}</div>
    </div>
  )
}

function EmployeeOverview() {
  const params = useParams()

  const { employeesData } = useSelector((store) => store.employees)
  const { wishesData } = useSelector((store) => store.wishes)

  const employee = employeesData.find((employee) => employee.id == params.id)
  const employeeWishesData = wishesData.filter(
    (data) => data.employee_id == params.id
  )

  const [employeeData, setEmployee] = useState({})

  useEffect(() => {
    employee !== undefined && setEmployee(employee)
  }, [employee])

  if (Object.keys(employeeData).length === 0) {
    return (
      <Container className="pb-5">
        <EmptyState title="Lädt …" description="Teammitglied wird geladen." />
      </Container>
    )
  }

  const fullName = `${employeeData.first_name} ${employeeData.last_name}`

  return (
    <Container className="pb-5">
      <PageHeader
        backTo="/employees"
        backLabel="Team"
        title={fullName}
        description="Profil, Dienstwünsche und Schicht-Präferenzen."
        actions={
          <Button
            href={`/employee/edit/${employeeData.id}`}
            variant="primary"
          >
            <FaUserEdit className="me-1" /> Daten bearbeiten
          </Button>
        }
        chips={[
          {
            label: employeeData.qualification.description,
            tone: 'brand',
          },
        ]}
      />

      <Card className="mb-3">
        <Card.Header>Stammdaten</Card.Header>
        <Card.Body>
          <div className="eq-data-grid">
            <DataItem label="Vorname" value={employeeData.first_name} />
            <DataItem label="Nachname" value={employeeData.last_name} />
            <DataItem
              label="Anstellung"
              value={`${employeeData.employment_ratio} %`}
            />
            <DataItem
              label="Tägliche Arbeitszeit"
              value={`${employeeData.daily_worktime} h`}
            />
            <DataItem
              label="Qualifikation"
              value={employeeData.qualification.description}
            />
          </div>
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>Dienstwünsche</Card.Header>
            <Card.Body>
              {employeeWishesData.length === 0 ? (
                <EmptyState
                  title="Keine Wünsche"
                  description="Für dieses Teammitglied sind keine Dienstwünsche hinterlegt."
                />
              ) : (
                <Table className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Datum</th>
                      <th>Dienst</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeWishesData.map((wishObject) => (
                      <WishColumn key={wishObject.id} wish={wishObject} />
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header>Schicht-Präferenzen</Card.Header>
            <Card.Body>
              <Preferences employeeId={employee.id} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default EmployeeOverview
