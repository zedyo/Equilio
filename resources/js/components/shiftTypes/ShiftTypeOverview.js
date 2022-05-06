import React from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import ShiftTypeCard from './show/ShiftTypeCard'

function ShiftTypes() {
  const { shiftTypesData } = useSelector((store) => store.shiftTypes)

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Schicht Arten</div>
              <div className="card-body">
                <Container style={{ margin: '0.3rem' }} fluid="sm">
                  <Button href={`/shift_type/create`} variant="outline-success">
                    Neue Schicht Art anlegen
                  </Button>
                </Container>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShiftTypes
