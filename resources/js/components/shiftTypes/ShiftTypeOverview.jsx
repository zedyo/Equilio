import React from 'react'
import { Button, Card, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import ShiftTypeCard from './show/ShiftTypeCard'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiLayers } from 'react-icons/fi'
import PageHeader from '../shared/PageHeader'
import EmptyState from '../shared/EmptyState'

function ShiftTypes() {
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)

  return (
    <Container className="pb-5">
      <PageHeader
        title="Schichtarten"
        description="Übergeordnete Arten (z. B. Frühdienst) mit Soll-/Optimalbesetzung."
        actions={
          <Button href="/shift_type/create" variant="primary">
            <AiOutlinePlus className="me-1" /> Neue Schichtart
          </Button>
        }
        chips={[{ label: `${shiftTypesData.length} Arten`, tone: 'brand' }]}
      />

      <Card>
        <Card.Body>
          {shiftTypesData.length === 0 ? (
            <EmptyState
              icon={<FiLayers />}
              title="Keine Schichtarten"
              description="Lege Schichtarten an, denen konkrete Schichten zugeordnet werden."
              action={
                <Button href="/shift_type/create" variant="primary">
                  <AiOutlinePlus className="me-1" /> Neue Schichtart
                </Button>
              }
            />
          ) : (
            <Row>
              {shiftTypesData.map((shiftTypeData) => (
                <ShiftTypeCard
                  key={shiftTypeData.id}
                  shiftTypeData={shiftTypeData}
                />
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ShiftTypes
