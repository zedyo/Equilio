import React from 'react'
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Row,
  Stack,
} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import ShiftTypeCard from './show/ShiftTypeCard'
import { AiOutlinePlus } from 'react-icons/ai'

function ShiftTypes() {
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)

  return (
    <>
      <Container style={{ padding: '2rem 0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Dienstplan</Breadcrumb.Item>
          <Breadcrumb.Item active>Einstellungen: Schicht Arten</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>Schicht Arten</div>
              <div className="ms-auto">
                <Button href={`/shift_type/create`} variant="outline-success">
                  <AiOutlinePlus /> Neue Schicht Art
                </Button>
              </div>
            </Stack>
          </Card.Header>
          <Card.Body>
            <Container fluid="sm">
              <Row>
                {shiftTypesData.map((shiftTypeData) => (
                  <ShiftTypeCard
                    key={shiftTypeData.id}
                    shiftTypeData={shiftTypeData}
                  />
                ))}
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default ShiftTypes
