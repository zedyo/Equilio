import React from 'react'
import { Button, Container, Dropdown, Navbar } from 'react-bootstrap'
import { FiSettings, FiLogOut } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import equilioMark from '../assets/equilio-mark.svg'
import { logout, selectAuth } from '../features/auth/authSlice'

function Navigation() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const isLeitung = user?.role === 'leitung'

  return (
    <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
      <Container fluid className="px-3 px-lg-5">
        <Navbar.Brand
          href={isLeitung ? '/duties' : '/'}
          className="d-flex align-items-center gap-2"
        >
          <img
            src={equilioMark}
            alt="Equilio"
            width="30"
            height="30"
            style={{ display: 'block' }}
          />
          <span style={{ fontWeight: 800 }}>Equilio</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="eq-navbar" />
        <Navbar.Collapse id="eq-navbar">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3 ms-lg-auto mt-3 mt-lg-0">
            {isLeitung && (
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-start"
                >
                  <FiSettings className="me-1" /> Einstellungen
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="/employees">Team</Dropdown.Item>
                  <Dropdown.Item href="/qualifications">
                    Qualifikationen
                  </Dropdown.Item>
                  <Dropdown.Item href="/shifts">Schichten</Dropdown.Item>
                  <Dropdown.Item href="/shift_types">
                    Schicht Arten
                  </Dropdown.Item>
                  <Dropdown.Item href="/absences">
                    Abwesenheiten
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            <span className="text-muted small">
              {user?.name}
              {' · '}
              {isLeitung ? 'Leitung' : 'Pflegekraft'}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => dispatch(logout())}
            >
              <FiLogOut className="me-1" /> Abmelden
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
