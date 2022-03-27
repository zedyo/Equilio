import React, { useState, Fragment } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import WishCreatorModal from './dutyOverview/wishCreator/wishCreatorModal/WishCreatorModal'

function Navigation() {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <Fragment>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/duties">Project Yeti</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/employees">Angestellte</Nav.Link>
            <Nav.Link href="/qualifications">Qualifikationen</Nav.Link>
            <Nav.Link href="/shift_types">Schicht Arten</Nav.Link>
            <Nav.Link href="/shifts">Schichten</Nav.Link>

            <>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Neuer Dienstwunsch
              </Button>

              <WishCreatorModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </>
          </Nav>
        </Container>
      </Navbar>
    </Fragment>
  )
}

export default Navigation
