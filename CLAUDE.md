# Equilio

> Dienstplanungs-Webanwendung für 24/7-Schichtbetriebe (insb. Pflegebranche).
> Bachelorarbeit (SAE Institut München, BA Web Development, 2021–2022) von Nikolai Seel.
>
> **Namenshistorie:** ursprünglich „Yeti" (Bachelor-Proposal) bzw. „yourPlan"
> (Repo). Produktname seit Mai 2026: **Equilio**. Der GitHub-Repo-Name und
> damit der Pages-Base-Pfad `/yourPlan/` bleiben unverändert (an das Repo
> gebunden), bis das Repository selbst umbenannt wird.

Diese Datei ist das primäre Gedächtnis für Claude. Detaillierte Notizen liegen unter `.claude/memory/`.

## Hintergrund (Kurzfassung)

Ziel des Projekts war die Entwicklung eines Prototyps, der die monatliche Dienstplanerstellung in der Pflege spürbar erleichtert — idealerweise per Algorithmus, der über einen sogenannten **„Belastungsindex"** Schichtkonstellationen bewertet und automatisch einen vernünftigen Plan vorschlägt, den die Leitungskraft anschließend manuell nachjustieren kann.

Volle Hintergrundgeschichte und MoSCoW-Ziele: siehe `.claude/memory/project-background.md`.

## Technologie-Stack

| Layer       | Technik                                                            |
|-------------|--------------------------------------------------------------------|
| Backend     | **PHP 8.2+ / Laravel 12** (`composer.json`)                        |
| Frontend    | React 19 + Redux Toolkit 2 + React-Bootstrap + React-Router-Dom 7 |
| Build       | **Vite 7** (`vite.config.js`), Sass (dart-sass)                   |
| HTTP-Client | axios 1.x                                                          |
| Datenbank   | MySQL 8 (lokal: SQLite genügt)                                     |
| Tests       | PHPUnit 11 (nur Skeleton vorhanden — keine echten Tests)          |

> **Modernisierungsstand (Mai 2026):** Frontend **und** Backend vollständig
> modernisiert. Frontend: laravel-mix→Vite, React 17→19, Router 5→7, RTK 1→2,
> axios 0.21→1.x — `npm audit`: **0 Schwachstellen** (vorher 22).
> Backend: Laravel 8 (EOL) → **Laravel 12 / PHP 8.2+** via frischem Skelett +
> Code-Port — `composer audit`: **0 Advisories**. Migrationen/Seeder/API
> gegen SQLite verifiziert (alle Endpunkte HTTP 200). Details:
> `.claude/memory/implementation-status.md` und `progress-log.md`.
>
> Hinweis: `docker-compose.yml` stammt noch aus dem alten Sail-Setup und ist
> nicht aktualisiert (für Demo/Backend nicht nötig) — Legacy, optional.

## Setup (Frontend)

```bash
npm install
npm run dev       # Vite Dev-Server (HMR)
npm run build     # Produktions-Build nach dist/
npm run preview   # gebautes dist/ lokal testen
```

Backend (Laravel 12) lokal:

```bash
composer install
cp .env.example .env && php artisan key:generate
# einfachster Weg: DB_CONNECTION=sqlite in .env setzen, dann:
touch database/database.sqlite
php artisan migrate --seed     # Stammdaten (siehe Seeder)
php artisan serve              # API unter http://localhost:8000/api
```

Die GitHub-Pages-Demo läuft weiterhin komplett ohne Backend
(In-Browser-Mock, siehe unten) und ist von Backend-Änderungen unberührt.

## Repository-Layout

```
app/
  Http/Controllers/       # 8 Controller (Duty, Employee, ShiftType, …)
  Models/                 # 9 Eloquent-Models
database/
  migrations/             # 11 Migrationen (siehe DB-Schema unten)
  seeders/                # 8 Seeder mit realistischen Pflege-Stammdaten
resources/js/
  app.js                  # Entry-Point
  store.js                # Redux-Store (8 Slices)
  router/index.js         # React-Router-Konfiguration
  views/                  # Page-Components (Home, Test)
  components/             # Feature-Komponenten (dutyOverview, employees, …)
  features/               # Redux-Slices + Async-Thunks pro Domäne
  util/                   # Helper (z. B. holidays.js)
routes/
  api.php                 # REST-Endpoints (alle Daten-Operationen)
  web.php                 # SPA-Catch-All → app.blade.php
```

## Datenbank-Schema (Kerntabellen)

| Tabelle               | Wichtige Spalten                                                                   |
|-----------------------|------------------------------------------------------------------------------------|
| `qualifications`      | `id`, `description`                                                                |
| `employees`           | `id`, `qualification_id`, `first_name`, `last_name`, `daily_worktime`, `employment_ratio` (SoftDelete) |
| `shift_types`         | `id`, `name`, `active_duty` (bool), `min_occupation`, `opt_occupation`             |
| `shifts`              | `id`, `abrv`, `shift_type_id`, `h_duration`, `color_hex`                           |
| `duties`              | `id`, `employee_id`, `shift_id`, `day`, `month`, `year`, `wish_injury`, `preference_injury` |
| `wishes`              | `id`, `employee_id`, `shift_id`, `day`, `month`, `year`                            |
| `preferences`         | `id`, `employee_id`, `shift_id`                                                    |
| `working_hours_diffs` | `id`, `employee_id`, `month`, `year`, `diff` (float)                               |

**Konzept**:
- **Shift** = konkrete Schicht mit Kürzel (`F1`, `S1`, `N1`, …) und Dauer; gehört zu einem **ShiftType** (Frühschicht, Spätschicht, …).
- **Duty** = an einem Datum einem Mitarbeiter zugeordnete Schicht.
- **Wish** = Wunsch eines Mitarbeiters für eine konkrete Schicht an einem Datum. Wird der Plan abweichend gesetzt, markiert das Backend `duty.wish_injury=1`.
- **Preference** = generelle Schichtpräferenz (kein Datum). Abweichungen → `duty.preference_injury=1`.
- `WorkingHoursDiff` = Saldo Soll/Ist pro Mitarbeiter pro Monat (Tabelle existiert, UI-Anbindung lückenhaft).

## API-Endpoints (kurz)

```
GET    /api/duties/{year}/{month}                 alle Duties eines Monats
GET    /api/duties/{year}/{month}/{employee_id}   Duties eines Mitarbeiters
GET    /api/duties                                Mitarbeiter-Übersicht
PATCH  /api/duty                                  Duty anlegen/aktualisieren
POST   /api/duty                                  Duty löschen (!)
POST   /api/wish                                  Wunsch erstellen
GET    /api/wishesByEmployee/{employee_id}        Wünsche eines MA
POST   /api/preference                            Präferenz erstellen
PATCH  /api/preference                            Präferenz löschen (!)

resource-Routes: qualifications, employees, shifts, shift_types,
                 wishes, preferences, working_hours_diffs
```

Hinweis: Die Schreib-Endpoints `/duty`, `/wish`, `/preference` sind
bewusst aktionsorientiert (Composite-Key statt `/{id}`), aber
verb-korrekt (PATCH/POST/DELETE) und seit Phase 1.3 per FormRequest
validiert (Fehleingabe → 422). CRUD-`update` liefert 200, `store` 201.

## Frontend-Routen (React-Router)

- `/` und `/duties` → `DutyOverview` (Monatskalender, Haupt-Page)
- `/employees`, `/employee/create|show|edit`
- `/shifts`, `/shift/create|edit`
- `/shift_types`
- `/qualifications`

## Wichtigste Komponenten

- `DutyOverview` — Kalenderartige Monatsmatrix (Mitarbeiter × Tage), Eintrag per Kürzel.
- `EmployeeRow` / `DutyCell` — Inputs mit Farbgebung anhand des ShiftTypes; `onBlur` ruft Redux-Thunks `postDuty` / `deleteDuty`.
- `EmployeeDetails` — Profil + Tabs für Wünsche/Präferenzen.
- `WishCreator` / `WishCreatorModal` — Wunsch-Eingabe.
- `ShiftTypeStatisticsContainer` — Min/Opt-Besetzung pro ShiftType je Tag (Soll/Ist-Abgleich).
- CRUD-Komponenten für Qualifications, Shifts, ShiftTypes.

## Implementierungsstand vs. Proposal

Vollständige Matrix unter `.claude/memory/implementation-status.md`.

| Ziel                                       | Priorität | Status        |
|--------------------------------------------|-----------|---------------|
| CRUD: Mitarbeiter / Schichten / Qualif.    | MUSS      | ✅ fertig     |
| Monatsübersicht / Kalender                 | MUSS      | ✅ fertig     |
| **Automatische Dienstplangenerierung**     | MUSS      | ✅ Prototyp   |
| Erweitertes Szenario (Urlaub/Krankheit)    | SOLL      | ⚠️ Abwesenheiten im Generator; UI offen |
| UI/UX, Wunschsystem                        | KANN      | ✅ fertig     |
| Separate Rollen-UI                         | KANN      | ✅ Sanctum + Rollen |
| **Belastungsindex**                        | (Kern)    | ✅ Prototyp   |
| Tests                                      | —         | ✅ PHPUnit 32 + Frontend 12 |

**Kern umgesetzt (Phase 2, Mai 2026):** `App\Services\StrainIndex` +
`App\Services\RosterGenerator` + `POST /api/duties/generate` erzeugen einen
bewerteten Monatsvorschlag (manuell nachjustierbar). Heuristik &
Vereinfachungen: `.claude/memory/algorithm-notes.md`. Offen bleiben
Feinkalibrierung (Soll-Stunden, Qualifikations-Mix) und Abwesenheits-/
Regelwerk-UI.

**Auth & Rollen (Phase 3.10, Mai 2026):** Laravel Sanctum (SPA-Cookie).
`users.role` (`leitung`/`pflegekraft`) + `users.employee_id`. API:
`/api/login` öffentlich, alles unter `auth:sanctum`; Planung/CRUD/
Gesamtansichten unter `role:leitung`; Pflegekraft nur Eigendaten
(Ownership via `Controller::authorizeEmployee`). Frontend: AuthGate +
rollenbasiertes Routing (Leitung = Voll-UI, Pflegekraft = `MyPlan`).
Demo-Mock bildet Login/Rollen nach. Demo-Accounts:
`leitung@equilio.test` / `pflege@equilio.test` (Passwort `password`).
SPA sendet Credentials (`axios.withCredentials`); echtes Backend
benötigt gleiche Origin wie API (Default `127.0.0.1:8000`).

## Online-Demo (GitHub Pages)

GitHub Pages kann Laravel/MySQL **nicht** ausführen. Für eine klickbare Online-Demo
läuft die React-App daher gegen ein **In-Browser-Mock-Backend**:

- `resources/js/mock/mockApi.js` — axios-Adapter, der die gesamte `/api/*`-API
  im Browser nachbildet (Seeder-Daten, CRUD, Wunsch-/Präferenz-Verletzungen).
  Persistenz via `localStorage`; `?reset` an die URL hängen setzt die Daten zurück.
- Aktivierung ausschließlich über `window.__YETI_DEMO__ = true` im Root-`index.html`
  (Vite-Entry). Im normalen Laravel-Betrieb wird der Mock **nicht** geladen.
- Im Demo-Modus nutzt der Router `HashRouter` statt `BrowserRouter`
  (GitHub Pages hat kein SPA-Fallback für tiefe Pfade).
- Deploy: `.github/workflows/deploy-pages.yml` baut `npm run build` (Vite,
  Base `/yourPlan/`, Ausgabe `dist/`), ergänzt `404.html`/`.nojekyll` und
  published via GitHub Pages (Trigger: Push auf den Doku-Branch oder `master`).
- Live: `https://zedyo.github.io/yourPlan/`

**Bereits eingerichtet (Repo-Owner):** Pages-Source = „GitHub Actions" und das
`github-pages`-Environment erlaubt Deployments vom Doku-Branch.

Build-Hinweise:
- JSX-haltige Dateien tragen die Endung `.jsx` (Vite/plugin-react transformiert
  nur diese; reine Logik wie Slices/Store/Mock bleibt `.js`).
- `vite.config.js` setzt `publicDir: false`, damit Laravels `public/`
  (Web-Root des Backends) nicht ins statische Deploy gelangt.
- Alt-Build-Kette (laravel-mix/webpack/node-sass) wurde vollständig entfernt.

## Konventionen & Hinweise

- Branch für laufende Doku/Entwicklung: `claude/add-project-documentation-1Qnpn` (Push erlaubt; Master nicht).
- Codestil: PSR via `.styleci.yml`; Frontend: Prettier (`.prettierrc`), ESLint (`.eslintrc`).
- Commit-Stil (aus `git log`): kurz, imperativ-englisch, z. B. `Add Statistics`, `Fix Shift duty selection`, `Optimize UI`. Keine Konvention für Conventional-Commits.
- Sprache: UI-Texte sind deutsch (Pflegebranche), Code-Identifier englisch.
- `web.php` rendert alles auf `app.blade.php` — alles Routing läuft im Frontend.

## Arbeitsweise des Agents

- **Autonomie (vom Nutzer erteilt, Mai 2026):** Bearbeitung, Commits und Push
  auf den Arbeitsbranch dürfen in diesem Projekt ohne Rückfrage erfolgen.
  Keine Bestätigungs-/Auswahlfragen für normale Entwicklungsarbeit. Ausnahmen
  bleiben: wirklich destruktive/irreversible Aktionen (z. B. Force-Push auf
  `master`, History-Rewrite) sowie inhaltlich mehrdeutige Produktentscheidungen.
- Bei eigenständigen Änderungen: kleine, fokussierte Commits mit aussagekräftiger Botschaft.
- Fortschritt mitschreiben in `.claude/memory/progress-log.md` (Datum, was gemacht, Lessons Learned).
- Wenn Code von Proposal-Zielen abweicht, in `.claude/memory/implementation-status.md` aktualisieren.
- Bei Algorithmus-Arbeit: Designentscheidungen + Belastungsindex-Heuristik dokumentieren in `.claude/memory/algorithm-notes.md` (anlegen sobald begonnen).

## Weiterführende Dokumente

- `ROADMAP.md` — phasierter Entwicklungsplan (Kern: Generator/Belastungsindex)

- `.claude/memory/project-background.md` — Zusammenfassung des Proposals + Ziele
- `.claude/memory/implementation-status.md` — Detaillierter Soll/Ist-Abgleich
- `.claude/memory/architecture.md` — Tieferer technischer Aufbau
- `.claude/memory/progress-log.md` — Tagebuch der Änderungen durch Claude
