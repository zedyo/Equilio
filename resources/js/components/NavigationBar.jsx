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
    <Navbar bg="light" variant="light">
      <Container fluid style={{ margin: '0 5rem' }}>
        <Navbar.Brand
          href={isLeitung ? '/duties' : '/'}
          className="d-flex align-items-center gap-2"
        >
          <img
            src={equilioMark}
            alt="Equilio"
            width="28"
            height="28"
            style={{ display: 'block' }}
          />
          <span style={{ fontWeight: 700 }}>Equilio</span>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3 ms-auto">
          {isLeitung && (
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
                <Dropdown.Item href="/absences">Abwesenheiten</Dropdown.Item>
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
            <FiLogOut /> Abmelden
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}

export default Navigation
