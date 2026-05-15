/**
 * Integrations-Smoke-Test des echten Frontends gegen das In-Browser-Mock.
 *
 * Verifiziert den modernisierten Stack end-to-end in jsdom:
 * React 19 Render, React-Router 7 (HashRouter), Redux Toolkit 2 Slices,
 * axios 1.x + Mock-Adapter, sowie die zentralen Screens mit Seeder-Daten.
 *
 * (Ein echter Headless-Browser ist in der CI-Umgebung nicht verfügbar –
 *  Netzwerk-Allowlist blockt den Browser-Download. Diese Suite deckt die
 *  funktionalen Migrations-Risiken ohne Browser ab.)
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function navigate(hash) {
  act(() => {
    window.location.hash = hash
    window.dispatchEvent(new Event('hashchange'))
    window.dispatchEvent(new Event('popstate'))
  })
}

let App

beforeAll(async () => {
  window.__EQUILIO_DEMO__ = true
  window.location.hash = '#/'
  // Erst nach gesetztem Flag importieren -> installMockApi() greift.
  App = (await import('../../resources/js/app.jsx')).default
})

describe('Equilio Demo – Smoke (modernisierter Stack)', () => {
  it('Dienstplan-Startseite lädt Seeder-Daten (React19/RTK2/axios1/Router7)', async () => {
    render(<App />)
    // Mitarbeiter aus dem Seeder erscheint -> kompletter Daten-Pfad ok.
    expect(await screen.findByText(/Albers/i, {}, { timeout: 8000 })).toBeInTheDocument()
  })

  it('Team-Seite zeigt Mitarbeiter-Tabelle mit Qualifikation', async () => {
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })
    navigate('#/employees')
    expect(await screen.findByText('Team', {}, { timeout: 5000 })).toBeInTheDocument()
    // Mehrere Mitarbeiter teilen sich Qualifikationen -> findAllByText.
    const quals = await screen.findAllByText(
      /Examinierte Pflegefachkraft/i,
      {},
      { timeout: 5000 }
    )
    expect(quals.length).toBeGreaterThan(0)
  })

  it('Qualifikationen-Seite listet Seeder-Qualifikationen', async () => {
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })
    navigate('#/qualifications')
    expect(
      await screen.findByText(/Beschäftigungstherapeut:in/i, {}, { timeout: 5000 })
    ).toBeInTheDocument()
  })

  it('Schicht-Arten-Seite listet Seeder-ShiftTypes', async () => {
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })
    navigate('#/shift_types')
    expect(
      await screen.findByText(/Frühschicht/i, {}, { timeout: 5000 })
    ).toBeInTheDocument()
  })

  it('Schichten-Seite listet Seeder-Schichten (Kürzel F1)', async () => {
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })
    navigate('#/shifts')
    expect(await screen.findByText('F1', {}, { timeout: 5000 })).toBeInTheDocument()
  })

  // Reproduziert den vom Nutzer gemeldeten 404: Navigation über das
  // Einstellungen-Dropdown (fest verdrahtete href-Links) muss client-seitig
  // über den Router laufen, nicht den Browser neu laden.
  it('Navigation via Nav-Dropdown bleibt clientseitig (kein 404)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })

    await user.click(await screen.findByText(/Einstellungen/i))
    await user.click(await screen.findByText('Team'))

    // Team-Seite gerendert -> Interceptor hat per Router navigiert.
    const quals = await screen.findAllByText(
      /Examinierte Pflegefachkraft/i,
      {},
      { timeout: 5000 }
    )
    expect(quals.length).toBeGreaterThan(0)
  })

  it('Abwesenheiten-Seite listet geseedete Abwesenheiten', async () => {
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })
    navigate('#/absences')
    expect(
      await screen.findByText(/Jahresurlaub/i, {}, { timeout: 5000 })
    ).toBeInTheDocument()
  })

  it('Automatische Plangenerierung liefert Belastungsindex (Phase 2)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })

    await user.click(
      await screen.findByText(/Plan automatisch generieren/i)
    )

    expect(
      await screen.findByText(/Belastungsindex:/i, {}, { timeout: 8000 })
    ).toBeInTheDocument()
  })

  it('Datepicker: Popover öffnet, Monatswahl & "Heute" funktionieren', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText(/Albers/i, {}, { timeout: 8000 })

    const year = new Date().getFullYear()
    // Trigger trägt das Jahr im Label (Nav-Buttons nicht).
    const trigger = await screen.findByRole('button', {
      name: new RegExp(`${year}`),
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    const dialog = await screen.findByRole('dialog', {
      name: /Monat wählen/i,
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    // Anderen Monat wählen -> Panel schließt, Label aktualisiert.
    await user.click(within(dialog).getByText('Juni'))
    expect(
      screen.queryByRole('dialog', { name: /Monat wählen/i })
    ).not.toBeInTheDocument()
    expect(
      await screen.findByRole('button', {
        name: new RegExp(`Juni ${year}`),
      })
    ).toBeInTheDocument()

    // "Heute" springt zum aktuellen Monat zurück.
    await user.click(
      await screen.findByRole('button', { name: new RegExp(`${year}`) })
    )
    const dialog2 = await screen.findByRole('dialog', {
      name: /Monat wählen/i,
    })
    await user.click(within(dialog2).getByRole('button', { name: 'Heute' }))
    expect(
      screen.queryByRole('dialog', { name: /Monat wählen/i })
    ).not.toBeInTheDocument()
  })
})
