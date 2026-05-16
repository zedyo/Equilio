import React from 'react'
import QualificationCard from './show/QualificationCard'
import { Button, Row, Container, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiAward } from 'react-icons/fi'
import PageHeader from '../shared/PageHeader'
import EmptyState from '../shared/EmptyState'

function Qualifications() {
  const { qualificationsData } = useSelector((store) => store.qualifications)

  return (
    <Container className="pb-5">
      <PageHeader
        title="Qualifikationen"
        description="Qualifikationsstufen, nach denen das Team gruppiert und geplant wird."
        actions={
          <Button href="/qualification/create" variant="primary">
            <AiOutlinePlus className="me-1" /> Neue Qualifikation
          </Button>
        }
        chips={[
          { label: `${qualificationsData.length} Einträge`, tone: 'brand' },
        ]}
      />

      <Card>
        <Card.Body>
          {qualificationsData.length === 0 ? (
            <EmptyState
              icon={<FiAward />}
              title="Keine Qualifikationen"
              description="Lege Qualifikationsstufen an (z. B. Examinierte Pflegefachkraft)."
              action={
                <Button href="/qualification/create" variant="primary">
                  <AiOutlinePlus className="me-1" /> Neue Qualifikation
                </Button>
              }
            />
          ) : (
            <Row>
              {qualificationsData.map((qualificationObject) => (
                <QualificationCard
                  key={qualificationObject.id}
                  qualificationData={qualificationObject}
                />
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Qualifications
