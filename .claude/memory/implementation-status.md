# Implementierungsstand vs. Proposal

Stand: erste Bestandsaufnahme bei Initialisierung des Claude-Memorys (Mai 2026, viele Jahre nach Abgabe — Bestand stammt aus dem ursprünglichen Bachelor-Projektzeitraum 2021/22).

## MUSS-Ziele

### ✅ Stammdaten-CRUD (Mitarbeiter, Schichten, Qualifikationen, ShiftTypes)

- Models: `Employee`, `Shift`, `ShiftType`, `Qualification`
- Controller: `EmployeeController`, `ShiftController`, `ShiftTypeController`, `QualificationController` — RESTful Resource Routes
- Frontend: Create/Edit/Show/Overview-Komponenten unter `resources/js/components/{employees,shifts,shiftTypes,qualifications}/`
- Seeder mit realistischen Pflege-Stammdaten

### ✅ Monatsübersicht (Kalender)

- `DutyOverview`-Komponente (`resources/js/components/dutyOverview/…`)
- Backend liefert über `GET /api/duties/{year}/{month}` alle Dienste eines Monats
- Wochentage + Feiertage werden im Frontend (`util/holidays.js`) gerendert
- `ShiftTypeStatisticsContainer` zeigt Min/Opt-Besetzung pro ShiftType je Tag

### ❌ Automatische Dienstplangenerierung — **FEHLT**

- **Kein Controller, kein Service, kein Artisan-Command** für die Generierung gefunden.
- `DutyController::update` legt einzelne Duties manuell an (eine Schicht pro Request).
- Es gibt **keinen Algorithmus**, der einen ganzen Monat generiert.
- Folge: das zentrale wissenschaftliche Ziel der Bachelorarbeit ist im Code-Stand offen.

## SOLL-Ziele

### ⚠️ Erschwertes Szenario (Urlaub / Krankheit)

- `ShiftTypeSeeder` legt Typen „Frei (bezahlt)" und „Fort- & Ausbildung" an — kein dediziertes Urlaubs- oder Krankheits-Modell.
- Es gibt **keine** eigene Tabelle für Abwesenheiten mit Start/End-Datum.
- Keine Logik, die Krankheit/Urlaub in die Generierung einbezieht (weil es ja keine Generierung gibt).

### ⚠️ Manuelle Nachjustierung ≤ 30 %

- Nicht messbar ohne Generator → entfällt.

## KANN-Ziele

### ✅ Wunschsystem

- Tabellen `wishes` und `preferences` vorhanden.
- `WishController` mit `create`, `getEmployeeWishData`, `destroy`.
- Beim Anlegen/Ändern einer `Duty` setzt das Backend `wish_injury` (Datums-spezifischer Wunsch verletzt?) und `preference_injury` (generelle Präferenz verletzt?).
- Frontend: `WishCreator`, `WishCreatorModal`, im `EmployeeDetails` Tabs für Wünsche & Präferenzen.
- Verletzungen werden im DutyCell visuell hervorgehoben (CSS-Klassen `wishInjury`, `preferenceInjury`).

### ✅ Bedienerfreundliche UI/UX

- React-Bootstrap-basiertes Layout, Farbcodes pro Schicht, Statistik-Panel, Loading-Spinner.
- Subjektiv „prototype-grade", aber funktional.

### ❌ Separate UIs für Rollen (Pflegekraft vs. Leitung)

- Es existiert das Standard-Laravel-`User`-Model, aber **keine Auth-Routen, keine Rollen, keine Policy/Gate-Konfiguration**.
- Die SPA ist vollständig öffentlich erreichbar.

### ⚠️ Nachjustierung ≤ 10 % — entfällt (kein Generator)

## Belastungsindex — **FEHLT**

- Kein Code zur Berechnung eines Belastungsindex.
- Kein Modell für eine numerische Mitarbeiter-Belastung.
- Lediglich `working_hours_diffs` (Soll/Ist-Saldo pro Monat) wäre ein Anker — wird derzeit aber kaum in der UI verwendet.

## Tests

- Nur `tests/Feature/ExampleTest.php` und `tests/Unit/ExampleTest.php` als Skeleton.
- Keine echten Tests.

## Sonstiges aus dem Code, das im Proposal nicht steht

- `WorkingHoursDiff`-Modell + Controller — Idee: pro Monat einen Saldo führen. UI-Anbindung schwach.
- `Test.js`-View: vermutlich Spielwiese, nicht aufgeräumt.
- `Duty::delete` läuft über `POST /api/duty` statt `DELETE` (REST-Verletzung).
- `Preference::delete` läuft über `PATCH /api/preference` (REST-Verletzung).

## Infrastruktur-/Sicherheitsstand (Mai 2026)

- **Frontend-Stack modernisiert:** Vite 7, React 19, Router 7, RTK 2, axios 1.x
  — `npm audit` 0 Schwachstellen (vorher 22).
- **Backend modernisiert:** Laravel 8 (EOL) → Laravel 12 / PHP 8.2+
  — `composer audit` 0 Advisories; API gegen SQLite verifiziert (alle
  Endpunkte HTTP 200).
- **REST-Cleanup erledigt:** `DELETE /duty` und `DELETE /preference` (vorher
  POST/PATCH); Eingabevalidierung in den Kern-CRUD-Controllern.
- **Phase-1-Fundament begonnen:** Abwesenheits-Modell (`absences`) inkl.
  validierter API + Tests; Regelwerk `config/rostering.php`. Damit ist die
  Voraussetzung für den Generator (erschwertes Szenario) gelegt — die
  Generierung selbst (Belastungsindex/RosterGenerator) bleibt offen.
- **Tests:** PHPUnit-Feature-Tests (9) + Frontend-Suite (6); beide in CI.
- Offen bleibt fachlich der Kern (Generator/Belastungsindex) sowie Auth/Rollen
  und die Abwesenheits-/Regelwerk-UI — siehe unten.

## Implikationen für künftige Arbeit

Wenn dieses Projekt weitergeführt werden soll, sind die offensichtlichsten nächsten Schritte:

1. **Generator-Service**: `app/Services/RosterGenerator.php` (oder Ähnliches) konzipieren, der einen Monat erzeugt.
2. **Belastungsindex**: numerische Bewertung pro Mitarbeiter und Konstellation; siehe Tabelle in `project-background.md`.
3. **Abwesenheits-Modell**: dedizierte Tabelle `absences` (employee_id, type, start_date, end_date).
4. **Authentifizierung & Rollen**: Login, Rolle `caregiver` / `manager`, Policies für Endpoints.
5. **Tests**: Mindestens Feature-Tests für die Generator-Heuristiken.
6. **REST-Cleanup**: `DELETE`/`PATCH`-Verben korrekt verwenden.
