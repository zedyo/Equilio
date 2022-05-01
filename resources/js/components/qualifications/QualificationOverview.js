import React from 'react'
import QualificationCard from './show/QualificationCard'
import { Button, Row, Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'

function Qualifications() {
  const { qualificationsData } = useSelector((store) => store.qualifications)

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Qualifikationen</div>

              <div className="card-body">
                <Container style={{ margin: '0.3rem' }} fluid="sm">
                  <Button
                    href={`/qualification/create`}
                    variant="outline-success"
                  >
                    Neue Qualifikation anlegen
                  </Button>
                </Container>
                <Container fluid="sm">
                  <Row>
                    {qualificationsData.map((qualificationObject) => (
                      <QualificationCard
                        key={qualificationObject.id}
                        qualificationData={qualificationObject}
                      />
                    ))}
                  </Row>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Qualifications
