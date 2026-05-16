import React, { useState } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login, selectAuth } from '../../features/auth/authSlice'
import equilioMark from '../../assets/equilio-mark.svg'

function LoginPage() {
  const dispatch = useDispatch()
  const { error } = useSelector(selectAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    await dispatch(login({ email, password }))
    setBusy(false)
  }

  const quick = (mail) => {
    setEmail(mail)
    setPassword('password')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background:
          'radial-gradient(1200px 600px at 50% -10%, #eef0ff 0%, #f6f8fa 55%, #f6f8fa 100%)',
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: '24rem' }}
        className="border-0 shadow-lg"
      >
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img src={equilioMark} alt="Equilio" width="48" height="48" />
            <h4 className="mt-3 mb-1 fw-bold">Equilio</h4>
            <small className="text-muted">Dienstplanung – Anmeldung</small>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={submit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={busy}>
              {busy ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Anmelden'
              )}
            </Button>
          </Form>

          <hr />
          <small className="text-muted d-block mb-2">
            Demo-Zugänge (Passwort: <code>password</code>):
          </small>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => quick('leitung@equilio.test')}
            >
              Als Leitung
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => quick('pflege@equilio.test')}
            >
              Als Pflegekraft
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default LoginPage
