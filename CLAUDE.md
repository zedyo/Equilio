# Projekt Yeti / yourPlan

> Dienstplanungs-Webanwendung für 24/7-Schichtbetriebe (insb. Pflegebranche).
> Bachelorarbeit (SAE Institut München, BA Web Development, 2021–2022) von Nikolai Seel.

Diese Datei ist das primäre Gedächtnis für Claude. Detaillierte Notizen liegen unter `.claude/memory/`.

## Hintergrund (Kurzfassung)

Ziel des Projekts war die Entwicklung eines Prototyps, der die monatliche Dienstplanerstellung in der Pflege spürbar erleichtert — idealerweise per Algorithmus, der über einen sogenannten **„Belastungsindex"** Schichtkonstellationen bewertet und automatisch einen vernünftigen Plan vorschlägt, den die Leitungskraft anschließend manuell nachjustieren kann.

Volle Hintergrundgeschichte und MoSCoW-Ziele: siehe `.claude/memory/project-background.md`.

## Technologie-Stack

| Layer       | Technik                                                            |
|-------------|--------------------------------------------------------------------|
| Backend     | PHP 8, Laravel 8 (`composer.json`)                                 |
| Frontend    | React 17 + Redux Toolkit + React-Bootstrap + React-Router-Dom 5    |
| Build       | Laravel Mix 6 (`webpack.mix.js`), Sass                             |
| Datenbank   | MySQL 8                                                            |
| Dev-Stack   | Laravel Sail (Docker), Redis, Mailhog, Selenium (`docker-compose.yml`) |
| Tests       | PHPUnit (nur Skeleton vorhanden — keine echten Tests)              |

## Setup

```bash
cp .env.example .env                 # DB-Settings anpassen (DB_DATABASE=projectyeti)
composer install
npm install
php artisan key:generate
php artisan migrate:fresh --seed     # legt Stammdaten an (siehe Seeder)
php artisan serve                    # http://localhost:8000
npm run watch                        # Frontend-Build mit Hot-Reload
```

Alternativ via Sail (`docker-compose.yml` enthält PHP 8, MySQL 8, Redis, Mailhog, Selenium).

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

Achtung: Verbs sind teils nicht REST-konform (siehe `routes/api.php`).

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
| **Automatische Dienstplangenerierung**     | MUSS      | ❌ **fehlt**  |
| Erweitertes Szenario (Urlaub/Krankheit)    | SOLL      | ⚠️ teilweise  |
| UI/UX, Wunschsystem                        | KANN      | ✅ fertig     |
| Separate Rollen-UI                         | KANN      | ❌ fehlt      |
| **Belastungsindex**                        | (Kern)    | ❌ **fehlt**  |
| Tests                                      | —         | ❌ fehlt      |

**Kernlücke**: Der zentrale Forschungsteil der Bachelor­arbeit — der Generator-Algorithmus mit Belastungsindex — ist im Code nicht zu finden. Vorhanden sind nur die Verletzungs-Flags `wish_injury` / `preference_injury` auf der `Duty`, die beim manuellen Eintrag gesetzt werden.

## Online-Demo (GitHub Pages)

GitHub Pages kann Laravel/MySQL **nicht** ausführen. Für eine klickbare Online-Demo
läuft die React-App daher gegen ein **In-Browser-Mock-Backend**:

- `resources/js/mock/mockApi.js` — axios-Adapter, der die gesamte `/api/*`-API
  im Browser nachbildet (Seeder-Daten, CRUD, Wunsch-/Präferenz-Verletzungen).
  Persistenz via `localStorage`; `?reset` an die URL hängen setzt die Daten zurück.
- Aktivierung ausschließlich über `window.__YETI_DEMO__ = true` in `demo/index.html`.
  Im normalen Laravel-Betrieb wird der Mock **nicht** geladen — das echte Backend
  bleibt unangetastet.
- Im Demo-Modus nutzt der Router `HashRouter` statt `BrowserRouter`
  (GitHub Pages hat kein SPA-Fallback für tiefe Pfade).
- Deploy: `.github/workflows/deploy-pages.yml` baut `npm run prod`, montiert
  `demo/index.html` + `public/js` + `public/css` zu `_site/` und published via
  GitHub Pages (Trigger: Push auf den Doku-Branch oder `master`).

**Einmalige Voraussetzung (manuell durch Repo-Owner):**
GitHub → Settings → Pages → *Source = GitHub Actions* aktivieren. Danach läuft
der Deploy bei jedem Push automatisch; die URL erscheint in der Action-Zusammenfassung.

Build-Hinweis: `node-sass` wurde entfernt (baut auf modernem Node nicht; dart-sass
`sass` ist bereits vorhanden). `webpack` ist via `overrides` auf `5.89.0` gepinnt,
da neuere Versionen `webpackbar`/`ProgressPlugin` von laravel-mix 6 brechen.

## Konventionen & Hinweise

- Branch für laufende Doku/Entwicklung: `claude/add-project-documentation-1Qnpn` (Push erlaubt; Master nicht).
- Codestil: PSR via `.styleci.yml`; Frontend: Prettier (`.prettierrc`), ESLint (`.eslintrc`).
- Commit-Stil (aus `git log`): kurz, imperativ-englisch, z. B. `Add Statistics`, `Fix Shift duty selection`, `Optimize UI`. Keine Konvention für Conventional-Commits.
- Sprache: UI-Texte sind deutsch (Pflegebranche), Code-Identifier englisch.
- `web.php` rendert alles auf `app.blade.php` — alles Routing läuft im Frontend.

## Arbeitsweise des Agents

- Bei eigenständigen Änderungen: kleine, fokussierte Commits mit aussagekräftiger Botschaft.
- Fortschritt mitschreiben in `.claude/memory/progress-log.md` (Datum, was gemacht, Lessons Learned).
- Wenn Code von Proposal-Zielen abweicht, in `.claude/memory/implementation-status.md` aktualisieren.
- Bei Algorithmus-Arbeit: Designentscheidungen + Belastungsindex-Heuristik dokumentieren in `.claude/memory/algorithm-notes.md` (anlegen sobald begonnen).

## Weiterführende Dokumente

- `.claude/memory/project-background.md` — Zusammenfassung des Proposals + Ziele
- `.claude/memory/implementation-status.md` — Detaillierter Soll/Ist-Abgleich
- `.claude/memory/architecture.md` — Tieferer technischer Aufbau
- `.claude/memory/progress-log.md` — Tagebuch der Änderungen durch Claude
