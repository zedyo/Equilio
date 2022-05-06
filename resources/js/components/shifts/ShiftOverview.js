import React from 'react'
import { Button, Row, Container } from 'react-bootstrap'
import ShiftCard from './show/ShiftCard'
import { useSelector } from 'react-redux'

function Shifts() {
  const { shiftsData } = useSelector((store) => store.shifts)

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Schichten</div>
              <div className="card-body">
                <Container style={{ margin: '0.3rem' }} fluid="sm">
                  <Button href={`/shift/create`} variant="outline-success">
                    Neue Schicht anlegen
                  </Button>
                </Container>
                <Container fluid="sm">
                  <Row>
                    {shiftsData.map((shiftsObject) => (
                      <ShiftCard
                        key={shiftsObject.id}
                        shiftsData={shiftsObject}
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

export default Shifts
