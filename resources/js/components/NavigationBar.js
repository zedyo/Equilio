import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import WishCreator from './dutyOverview/wishCreator/WishCreator'

function Navigation() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/duties">Project Yeti</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/employees">Angestellte</Nav.Link>
            <Nav.Link href="/qualifications">Qualifikationen</Nav.Link>
            <Nav.Link href="/shift_types">Schicht Arten</Nav.Link>
            <Nav.Link href="/shifts">Schichten</Nav.Link>
            <WishCreator />
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Navigation
