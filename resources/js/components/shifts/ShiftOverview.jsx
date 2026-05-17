import React from 'react'
import { Button, Row, Container, Card } from 'react-bootstrap'
import ShiftCard from './show/ShiftCard'
import { useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiClock } from 'react-icons/fi'
import PageHeader from '../shared/PageHeader'
import EmptyState from '../shared/EmptyState'

function Shifts() {
  const { shiftsData } = useSelector((store) => store.shifts)

  return (
    <Container className="pb-5">
      <PageHeader
        title="Schichten"
        description="Konkrete Schichten mit Kürzel, Dauer und Farbe – Grundlage des Plans."
        actions={
          <Button href="/shift/create" variant="primary">
            <AiOutlinePlus className="me-1" /> Neue Schicht
          </Button>
        }
        chips={[{ label: `${shiftsData.length} Schichten`, tone: 'brand' }]}
      />

      <Card>
        <Card.Body>
          {shiftsData.length === 0 ? (
            <EmptyState
              icon={<FiClock />}
              title="Keine Schichten"
              description="Lege Schichten an (z. B. F1 Frühdienst), um den Plan zu füllen."
              action={
                <Button href="/shift/create" variant="primary">
                  <AiOutlinePlus className="me-1" /> Neue Schicht
                </Button>
              }
            />
          ) : (
            <Row>
              {shiftsData.map((shiftsObject) => (
                <ShiftCard key={shiftsObject.id} shiftsData={shiftsObject} />
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Shifts
