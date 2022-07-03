import React from 'react'
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { FiSettings } from 'react-icons/fi'

function Navigation() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container fluid style={{ margin: '0 5rem' }}>
          <Navbar.Brand href="/duties">Dienstplan</Navbar.Brand>

          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-start">
              <FiSettings /> Einstellungen
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/employees">Team</Dropdown.Item>
              <Dropdown.Item href="/qualifications">
                Qualifikationen
              </Dropdown.Item>
              <Dropdown.Item href="/shifts">Schichten</Dropdown.Item>
              <Dropdown.Item href="/shift_types">Schicht Arten</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
    </>
  )
}

export default Navigation
