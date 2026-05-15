# Architektur — Equilio (vormals Yeti / yourPlan)

## Gesamtbild

Klassische Laravel-API + React-SPA. Server liefert über `web.php` ein einziges Blade-Template (`app.blade.php`), das die React-App lädt. Alle Daten gehen über JSON-API unter `/api/*`.

```
┌──────────────────────────────────────────────┐
│ Browser                                      │
│  ┌────────────────────────────────────────┐  │
│  │ React SPA  (resources/js)              │  │
│  │  Router  →  Views/Components           │  │
│  │  Redux Store (8 Slices, async thunks)  │  │
│  └────────────┬───────────────────────────┘  │
└───────────────┼──────────────────────────────┘
                │ JSON via axios
┌───────────────▼──────────────────────────────┐
│ Laravel 8 (PHP 8)                            │
│  routes/api.php  →  Controllers              │
│  Eloquent Models  ↔  MySQL                   │
└──────────────────────────────────────────────┘
```

## Backend-Details

### Layering

Aktuell **keine Service-Schicht**: Geschäftslogik liegt direkt in den Controllern. `DutyController::update` enthält die größte Logik (Wunsch- und Präferenz-Verletzungen berechnen).

### Models (`app/Models/`)

```
Qualification ──< Employee ──< Duty >── Shift >── ShiftType
                  │              │       
                  │              ▼
                  ├── Wish ─── Shift (für day/month/year)
                  ├── Preference ── Shift
                  └── WorkingHoursDiff (month/year/diff)
```

- `Employee` benutzt SoftDeletes (siehe Migration).
- `Duty` hält die Verletzungs-Flags (`wish_injury`, `preference_injury`).
- `ShiftType.active_duty` unterscheidet „echte" Dienste von z. B. „Frei" oder „Fortbildung".
- `ShiftType.min_occupation` / `opt_occupation` für Soll-Besetzung.

### API-Konventionen

- Resource-Routen über `Route::resources([…])` für 7 Ressourcen.
- Custom-Routes für Duties (Filter nach Jahr/Monat/Employee).
- **REST-Inkonsistenzen** (sollten irgendwann korrigiert werden):
  - `POST /api/duty` löscht (statt `DELETE`).
  - `PATCH /api/preference` löscht (statt `DELETE`).
- Antworten als nackte arrays/objects mit Top-Level-Keys (`['duties' => $duties]` etc.) — kein Resource-Wrapping.

### Seeder

- `QualificationSeeder`: 4 Qualifikationen (Exam. Pfleger, Qual. Pflegehelfer, …).
- `ShiftTypeSeeder`: 6 Schichttypen (Früh, Spät, Nacht, Zwischen, Frei, Fort-&-Ausbildung).
- `ShiftSeeder`: 8 konkrete Schichten (F1, F2, S1, S2, N1, N2, U1, K1) mit Farben.
- `EmployeeSeeder`: 1 Test-MA + 10 per Factory.

## Frontend-Details

### Entry & Bootstrap

- `app.js` mounted `<Router />` aus `resources/js/router/index.js`.
- `bootstrap.js` initialisiert axios mit CSRF-Token.

### Redux

Store-Komposition (`store.js`):

```js
{ employees, qualifications, duties, shifts, shiftTypes,
  wishes, preferences, workingHoursDiffs }
```

Jeder Slice hat:
- `state.{data, status, error}`
- Async-Thunks für Fetch/Create/Update/Delete
- Selektoren auf `state.<domain>.data`

### Komponenten-Hierarchie (DutyOverview als Beispiel)

```
DutyOverview
├── DateSelector (Monat/Jahr)
├── DaysRow (Header mit Wochentagen + Feiertagen)
├── ShiftTypeStatisticsContainer
│   └── ShiftTypeStatisticsRow (min/opt vs. Ist je Tag)
└── EmployeeRow (pro Mitarbeiter, gruppiert nach Qualifikation)
    └── DutyCell (Input pro Tag)
```

### Datenfluss beim Eintrag einer Schicht

1. User tippt `F1` in `DutyCell`, `onBlur`.
2. `postDuty`-Thunk → `PATCH /api/duty` mit `dutyData={employee_id, day, month, year, value}`.
3. Backend (`DutyController::update`):
   a. Sucht Shift per `abrv`.
   b. Sucht existierende Duty → erstellt/aktualisiert.
   c. Vergleicht mit Wish (Datums-spezifisch) → `wish_injury`.
   d. Vergleicht mit Preference (generell) → `preference_injury`.
   e. Antwortet mit `new_duty` (eager-loaded mit `shift.shift_type`).
4. Redux merged Antwort in `duties.data`.
5. UI rendert farblich (`color_hex` aus `Shift`) und markiert Verletzungen via CSS-Klassen.

## Build

- `webpack.mix.js`:
  - `mix.js('resources/js/app.js', 'public/js').react()`
  - `mix.sass('resources/sass/app.scss', 'public/css')`
- Output landet in `public/js` und `public/css`, eingebunden im Blade-Template.

## Docker-Stack (`docker-compose.yml`)

Laravel Sail mit:
- `laravel.test` (PHP 8 App)
- `mysql` (8.0, Port 3306)
- `redis` (für Sessions/Cache)
- `mailhog` (Mail-Capture, Web-UI an Port 8025)
- `selenium` (für Browser-Tests, ungenutzt)
- (kommentiert) `meilisearch`

## Bekannte technische Schulden

- Keine Service-Klassen → Controller-Bloat (insb. `DutyController`).
- Keine Auth.
- REST-Inkonsistenzen (siehe oben).
- Keine Tests.
- `dev-dependencies` und `dependencies` in `package.json` etwas willkürlich verteilt (z. B. `node-sass` als prod-dep).
- `Test.js`-View ist tot.
