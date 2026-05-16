import React from 'react'
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import equilioMark from '../assets/equilio-mark.svg'
import { logout, selectAuth } from '../features/auth/authSlice'
import './navigation.scss'

const STAMMDATEN = [
  { href: '/shifts', label: 'Schichten' },
  { href: '/shift_types', label: 'Schichtarten' },
  { href: '/qualifications', label: 'Qualifikationen' },
  { href: '/absences', label: 'Abwesenheiten' },
]

function Navigation() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  const isLeitung = user?.role === 'leitung'
  const { pathname } = useLocation()

  const isActive = (prefixes) =>
    prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))

  const teamActive = isActive(['/employees', '/employee'])
  const stammdatenActive = isActive([
    '/qualifications',
    '/qualification',
    '/shifts',
    '/shift',
    '/shift_types',
    '/shift_type',
    '/absences',
    '/absence',
  ])
  const planActive = !teamActive && !stammdatenActive

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
          {isLeitung ? (
            <Nav className="eq-nav me-auto ms-lg-4 mt-3 mt-lg-0">
              <Nav.Link href="/duties" active={planActive}>
                Dienstplan
              </Nav.Link>
              <Nav.Link href="/employees" active={teamActive}>
                Team
              </Nav.Link>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  className={`eq-nav__dd ${stammdatenActive ? 'active' : ''}`}
                >
                  Stammdaten <FiChevronDown size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {STAMMDATEN.map((item) => (
                    <Dropdown.Item key={item.href} href={item.href}>
                      {item.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav className="eq-nav me-auto ms-lg-4 mt-3 mt-lg-0">
              <Nav.Link href="/" active>
                Mein Plan
              </Nav.Link>
            </Nav>
          )}

          <Dropdown align="end" className="mt-2 mt-lg-0">
            <Dropdown.Toggle
              variant="outline-secondary"
              size="sm"
              className="d-inline-flex align-items-center gap-2"
            >
              <FiUser />
              <span className="d-none d-sm-inline">{user?.name}</span>
              <span className="eq-role-badge">
                {isLeitung ? 'Leitung' : 'Pflegekraft'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>
                {user?.name}
                <div className="text-muted small">{user?.email}</div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => dispatch(logout())}>
                <FiLogOut className="me-2" />
                Abmelden
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
