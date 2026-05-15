# Progress Log

Chronologisches Tagebuch der Arbeit, die Claude an diesem Projekt verrichtet. Format: neueste Einträge oben.

---

## 2026-05-15 — Initial-Setup der Projektdokumentation

**Was:** Erstmaliges Onboarding auf dem Branch `claude/add-project-documentation-1Qnpn`.

- `fff6298d-CMN6100majorprojectproposalnik1.pdf` (Major-Project-Proposal von Nikolai Seel, 19.09.2021) gelesen.
- Codebasis vollständig kartografiert (Models, Controller, Routes, React-Komponenten, Redux-Slices, Migrationen, Seeder).
- `CLAUDE.md` im Root angelegt — primäres Memory.
- Verzeichnis `.claude/memory/` mit ergänzenden Notizen:
  - `project-background.md` — Hintergrund + MoSCoW-Ziele aus dem Proposal.
  - `implementation-status.md` — Soll/Ist-Abgleich Proposal vs. Code.
  - `architecture.md` — technischer Aufbau.
  - `progress-log.md` — diese Datei.

**Lessons Learned:**
- Das zentrale wissenschaftliche Ziel der Bachelorarbeit (Generator-Algorithmus mit Belastungsindex) ist im Code **nicht** umgesetzt. Der vorliegende Stand ist ein voll funktionsfähiges **manuelles** Schichtplanungs-Tool inkl. Wunsch- und Präferenzsystem.
- Codebasis ist Laravel 8 + React 17 + Redux Toolkit, recht klassisch strukturiert; keine Service-Schicht, keine Auth, keine echten Tests.
- Branch-Konvention: `claude/...` für Claude-Arbeit; nicht auf `master` pushen.

**Offene Fragen für nächste Session:**
- Soll der Generator-Algorithmus jetzt nachgebaut werden? Falls ja: in welchem Scope (nur „optimales Szenario" oder direkt mit Urlaub/Krankheit)?
- Soll Authentifizierung ergänzt werden?
- Soll der REST-Wildwuchs (POST = Delete) aufgeräumt werden?

---

## 2026-05-15 — Online-Demo via GitHub Pages

**Was:** Statische, klickbare Demo ohne Backend gebaut (PR #1).

- `resources/js/mock/mockApi.js`: vollständiger axios-Mock-Adapter, der alle
  `/api/*`-Endpunkte (duties, employees, qualifications, shifts, shift_types,
  wishes, preferences, working_hours_diffs) im Browser nachbildet. Seed-Daten =
  Laravel-Seeder + vorbefüllter Beispiel-Monat. Persistenz via localStorage,
  `?reset` setzt zurück.
- Aktivierung nur über `window.__YETI_DEMO__` (gesetzt in `demo/index.html`) →
  echtes Laravel-Backend bleibt unberührt. Router nutzt im Demo-Modus HashRouter.
- `.github/workflows/deploy-pages.yml`: baut & deployt nach GitHub Pages.
- Build-Reparatur: `node-sass` entfernt (gyp-Fehler auf Node 22; dart-sass war
  schon da), `webpack` via overrides auf 5.89.0 gepinnt (webpackbar-Bruch).
  `npm run prod` läuft jetzt durch (`webpack compiled successfully`,
  app.js 9,4 MB → 1,4 MB minifiziert).

**Verifiziert:** Build kompiliert; statische Site liefert index.html/app.js/
app.css/404.html mit HTTP 200; Mock-Code ist im Bundle enthalten.
**Nicht verifiziert:** Interaktiver Browser-Test (kein Headless-Browser in der
Sandbox). Funktionale Endkontrolle erfolgt über die deployte Pages-URL.

**Offen / Nutzeraktion nötig:** Repo-Owner muss einmalig
GitHub → Settings → Pages → Source = „GitHub Actions" aktivieren.

**Lessons Learned:**
- Dieses 2021/22er laravel-mix-6-Projekt ist toolchain-fragil auf modernem Node;
  Pinning (webpack) + dart-sass statt node-sass ist die stabile Kombination.
- Die hartkodierte API-Basis-URL `http://127.0.0.1:8000` in jedem Slice macht
  einen zentralen axios-Adapter zum saubersten Mock-Punkt (kein Slice-Eingriff).

## 2026-05-15 — Frontend-Stack-Modernisierung (Phase „Frontend voll")

**Was:** Kompletter Frontend-Tech-Stack aktualisiert; Sicherheits-Audit umgesetzt.

- **Audit-Ausgangslage:** npm 22 Schwachstellen (alle aus webpack-Build-Kette,
  build-only), echtes Laufzeitrisiko axios 0.21. Composer: Laravel 8 ist EOL und
  installiert auf PHP ≥ 8.2 nicht mehr (→ Backend separat, Nutzer-Entscheidung).
- **Build:** laravel-mix 6 / webpack / node-sass / webpackbar **komplett entfernt**
  → **Vite 7** + `@vitejs/plugin-react`. `vite.config.js`: base `/yourPlan/`,
  `publicDir: false` (Laravels public/ nicht deployen), Sass loadPaths node_modules.
- **ESM:** `require()` in `bootstrap.js`/`app` auf ESM-Imports umgestellt;
  jQuery/Popper/Bootstrap-JS-Setup entfernt (nirgends genutzt; nur axios-Global blieb).
- **Dateiendungen:** alle 37 JSX-haltigen `.js` → `.jsx` umbenannt (plugin-react
  transformiert via HTML-Entry/Rollup nur `.jsx`; reine Logik bleibt `.js`).
- **React 17 → 19:** `ReactDOM.render` → `createRoot`. Tote View `views/Test.js`
  gelöscht.
- **react-router-dom 5 → 7:** `Switch`→`Routes`, `component=`→`element=`,
  `exact` entfernt. (Kein `useHistory`/`withRouter`/`Redirect` im Code → einfach.)
- **Redux Toolkit 1 → 2 / react-redux 8 → 9:** alle 8 Slices von
  `extraReducers`-Object-Form auf Builder-Callback umgestellt (RTK-2-Breaking).
- **axios 0.21 → 1.x:** Laufzeit-CVE behoben; Mock-Adapter kompatibel.
- **Weitere Majors:** FontAwesome 6/0.1→7/3, react-icons 4→5, prettier 2→3,
  typescript 4→5.7, bootstrap→5.3.3; ungenutzte Deps (lodash, font-awesome v4,
  babel-plugin-macros, popper.js, jquery-Global) entfernt.
- **Workflow:** `deploy-pages.yml` auf `npm run build` (Vite) + `dist/` umgestellt.
- **SCSS:** `~bootstrap/...`-Imports (webpack-Syntax) → `bootstrap/scss/bootstrap`;
  4 fehlerhafte `import style from '*.scss'` → Side-Effect-Imports.

**Verifiziert:** `npm install` → **0 vulnerabilities** (vorher 22).
`npm run build` grün (491 Module, ~16 s); `vite preview` liefert die Demo unter
`/yourPlan/` korrekt aus (HTTP 200, Assets gehasht).
**Nicht verifiziert:** interaktiver Browser-Test (kein Headless-Browser) —
funktionale Endkontrolle über die deployte Pages-URL.

**Offen:** Backend-Modernisierung (Laravel 8 EOL → 11/12, PHP 8.2+) — bewusst
in spätere, separate Phase verschoben (Nutzer-Entscheidung). Demo nicht betroffen.

**Lessons Learned:**
- Vite + JSX-in-`.js`: plugin-react `include` griff nicht zuverlässig; saubere
  Lösung ist konsequente `.jsx`-Endung statt esbuild-Loader-Hacks.
- `publicDir` default (`public/`) ist bei Laravel-Repos eine Falle — Vite würde
  sonst `index.php` & alte Mix-Bundles ins Pages-Deploy kopieren.

## 2026-05-15 — Backend-Modernisierung Laravel 8 (EOL) → Laravel 12

**Was:** Vollständige Backend-Migration auf supporteten Stack.

- **Methode:** Frisches `laravel/laravel:^12` Skelett gescaffoldet und den
  App-Code portiert (statt 4 In-Place-Upgrade-Guides). Das Backend war ein
  unverändertes Standard-L8-Skelett → Port ist der risikoärmste Weg.
- **Portiert (unverändert):** 8 Domain-Models, 8 Controller, 8 Domain-Migrationen,
  Seeder, Factories, `routes/api.php`, `config/cors.php`.
- **Ersetzt durch L12-Skelett:** `bootstrap/app.php` (jetzt mit
  `withRouting(api: …, apiPrefix: 'api')`), minimaler Basis-`Controller`,
  L12-`User`-Model, L12-Config-Set, L12 Default-Migrationen
  (0001_01_01 users/cache/jobs), `public/index.php`, `artisan`, `phpunit.xml`.
- **Entfernt (in L11/12 obsolet):** `app/Http/Kernel.php`,
  `app/Console/Kernel.php`, alle `app/Http/Middleware/*`, `app/Exceptions`,
  Auth/Broadcast/Event/Route-ServiceProvider, `routes/channels.php`,
  `server.php`, alte Default-Migrationen, `resources/views/app.blade.php`
  (SPA wird via Vite/Pages bedient, nicht mehr per Blade).
- **composer.json:** `php ^8.2`, `laravel/framework ^12`; entfernt:
  `fideloper/proxy`, `fruitcake/laravel-cors` (beide jetzt Framework-intern),
  `laravel/ui` (ungenutzt). dev: phpunit 11, collision 8, pail, pint.

**Verifiziert (im Repo, PHP 8.4):**
- `composer install` grün, **`composer audit`: 0 Advisories**.
- `php artisan migrate --seed` (SQLite) grün — alle 11 Migrationen + Seeder.
- `php artisan serve` + curl: `/api/employees`, `/qualifications`, `/shifts`,
  `/shift_types`, `/duties/2026/5`, `/wishes`, `/preferences`, `/up`
  → alle **HTTP 200** mit korrektem JSON.

**Bewusst nicht angefasst:** `docker-compose.yml` (altes Sail-Setup) — Legacy,
für Demo/Backend nicht nötig; in CLAUDE.md als optional markiert.

**Lessons Learned:**
- Bei unverändertem Standard-Skelett ist „fresh scaffold + code port"
  deutlich verlässlicher als die Kette der Upgrade-Guides.
- L11/12 hat kein `app/Http/Kernel.php`/Middleware-Verzeichnis mehr — Routing
  & Middleware laufen über `bootstrap/app.php`.

## 2026-05-15 — Funktionale Verifikation: jsdom-Integrationssuite

**Was:** Echter Headless-Browser (Playwright/Chromium) ist in der Umgebung
nicht möglich — Netzwerk-Allowlist blockt den Browser-CDN (`403 Host not in
allowlist`), kein System-Chromium. Ersatz: **Vitest + Testing-Library + jsdom**
Integrationssuite, die die echte App gegen das Demo-Mock mountet.

- `tests/frontend/app.smoke.test.jsx` + `tests/frontend/setup.js`,
  `vite.config.js` um `test`-Block erweitert (jsdom, testTimeout 20s),
  npm-Script `test` = `vitest run`. devDeps: vitest, @testing-library/*, jsdom.
- Deckt end-to-end ab: React 19 Render, React-Router 7 (HashRouter-Navigation),
  Redux Toolkit 2 Slices, axios 1.x + Mock-Adapter, alle Haupt-Screens mit
  Seeder-Daten (Dienstplan, Team, Qualifikationen, Schicht-Arten, Schichten).
- **Realer Bug gefunden & gefixt:** `/api/shifts` im Mock lieferte kein
  verschachteltes `shift_type` → `ShiftCard` (`shiftsData.shift_type.name`)
  crashte; betraf auch die Live-Demo. Mock liefert Shifts jetzt mit
  `withShiftType` (entspricht `ShiftController@index` = `Shift::with('shift_type')`).
- CI: `npm test`-Schritt in `deploy-pages.yml` vor dem Build → Deploy nur bei
  grünen Tests.

**Ergebnis:** `npm test` 5/5 grün, `npm audit` 0, Vite-Build grün.

**Lessons Learned:**
- jsdom-Suite ersetzt keinen Pixel-/CSS-Test, fängt aber genau die
  Stack-Migrations-Regressionen — und hat sofort einen echten Mock-Bug entlarvt.
- `findByText` wirft bei Mehrfachtreffer → bei geteilten Werten `findAllByText`.

## 2026-05-15 — Fix: 404 bei Navigation in der Pages-Demo

**Problem (Nutzer-Report):** In der GitHub-Pages-Demo nur Startseite sichtbar;
andere Seiten → 404.

**Ursache:** ~47 fest verdrahtete interne `href="/pfad"`-Anker in
react-bootstrap-Komponenten (Navbar.Brand/Dropdown.Item/Breadcrumb.Item/
Button). Im alten Laravel-Setup fing der Server-Fallback das ab; in der
statischen Pages-Demo (HashRouter, Base `/yourPlan/`) lädt der Browser
echte URLs wie `zedyo.github.io/employees` → 404.

**Fix:** Zentraler `InternalLinkInterceptor` in `router/index.jsx` — fängt
Klicks auf interne Links global ab und navigiert über `useNavigate()`
(router-agnostisch: HashRouter-Demo wie BrowserRouter). Eine Änderung statt
47; deckt auch künftige Links ab. Externe/Hash/Download/Modifier-Klicks
werden korrekt ignoriert.

**Test:** Regressionstest ergänzt (Nav-Dropdown → Team, clientseitig) —
`npm test` **6/6 grün**, Build grün.

## 2026-05-15 — Dienstplan-Layout zentriert & Spalten fluchten; Roadmap

**Problem (Nutzer):** Hauptseite nicht mittig; Kalenderspalten nicht
sauber untereinander.

**Ursache:** Drei verschiedene Spaltengeometrien — Kopfzeile
(`auto | …`), Mitarbeiterzeilen (`auto | …`), Statistik (`auto | …`) —
plus `DaysRow` auf **32** Spalten hardcodiert statt echter Tageszahl.
Unterschiedliche `auto`-Erstspalten ⇒ Tagesspalten starten an
verschiedenen X-Positionen.

**Fix:** Einheitliches Board-Raster überall: `16rem | N×2.2rem | 6rem`.
- `DaysRow`: inline-Raster + Label-/Tail-Spacer, nicht mehr 32 hardcodiert.
- `EmployeeRow`: Erstspalte `auto`→`16rem`.
- `EmployeeCell`: feste 16rem, Flex, Ellipsis (lange Namen sprengen das
  Raster nicht mehr).
- `ShiftTypeStatisticsColumn`: `auto`→`16rem`; `.sumCells` 2.2rem-Spalten.
- `DateSelector` aus dem Raster gelöst (eigene zentrierte Leiste).
- Neues `.dutyBoard { width:max-content; margin:0 auto }` → gesamtes
  Board als Einheit zentriert; alle Spalten fluchten exakt.

**Verifiziert:** `npm test` 6/6 grün, Build grün. **Visuell nicht
prüfbar** (kein Browser) — Geometrie ist nun mathematisch identisch,
visuelles Feintuning ggf. nach Nutzer-Klick.

**Roadmap:** `ROADMAP.md` (Phasen 1–4) angelegt — Kern bleibt der noch
fehlende Generator/Belastungsindex.

## 2026-05-15 — Rebrand auf „Equilio" + Logo eingebaut

**Was:** Projekt projektweit von „Yeti/yourPlan" auf **Equilio** umbenannt;
Logo-Konzept „Grid-E" als Marke gewählt und eingebunden.

- 5 Logo-Vorschläge als SVG unter `docs/branding/`; gewähltes Logo =
  `equilio-logo.svg` (Grid-E). Icon-only Mark:
  `resources/js/assets/equilio-mark.svg`.
- **Eingebaut:** Favicon in `index.html` (inline SVG-Data-URI),
  Navbar-Brand zeigt Mark + „Equilio" (`NavigationBar.jsx`).
- **Umbenannt:** Demo-Flag `__YETI_DEMO__` → `__EQUILIO_DEMO__`
  (index.html, app.jsx, router, mock, Test); Mock-StorageKey
  `yeti_demo_db_v1` → `equilio_demo_db_v1` (forciert sauberen Reseed inkl.
  Shift-Type-Fix); `<title>` „Project Yeti – Demo" → „Equilio – Demo".
- **Doku:** CLAUDE.md/README/ROADMAP/architecture.md auf Equilio
  umgestellt (mit Namenshistorie-Notiz). `project-background.md` bewusst
  historisch belassen (Proposal-Stand „Yeti", inkl. „Warum Yeti?").
- **Bewusst unverändert:** Repo-/Pages-Base-Pfad `/yourPlan/`
  (`vite.config.js`, Workflow) — an den GitHub-Repo-Namen gebunden; ändert
  sich erst, wenn das Repository selbst umbenannt wird.

## 2026-05-15 — Optimierungen: Phase-1-Fundament + technische Härtung

Zwei Tracks parallel umgesetzt.

**Track A — Generator-Fundament (ROADMAP Phase 1):**
- `absences`-Tabelle/-Model/-Controller (validierte CRUD, Employee-Relation,
  `coversDate()`-Helper), API-Resource, Factory, Seeder.
- `config/rostering.php`: Regelwerk (max. Dienste in Folge, Ruhezeit,
  verbotene Übergänge, Belastungs-Gewichte) — Lesegrundlage für den
  künftigen StrainIndex/Generator.
- Mock-Parität + Redux-Slice `absenceSlice` + Store-Eintrag.

**Track B — Technische Härtung:**
- Vite `manualChunks`: App-Chunk 533→265 kB, Vendor cachebar getrennt.
- REST-Verben korrigiert: `POST /duty`→`DELETE /duty`,
  `PATCH /preference`→`DELETE /preference` (Backend-Routes, `dutySlice`
  `axios.delete`, Mock-Handler in Lockstep).
- Eingabevalidierung in Employee/Qualification/Shift/ShiftType (store+update)
  via `$request->validate()` (Dot-Notation auf die *Data-Payloads).
- Backend-Tests: `AbsenceApiTest` (4) + `ApiSmokeTest` (3) — GET-Endpunkte,
  Validierung 422, DELETE-Verb. Neuer CI-Workflow `backend-tests.yml`
  (PHP 8.3, sqlite, `php artisan test`).

**Verifiziert:** `php artisan test` **9/9**, `npm test` **6/6**, Vite-Build
grün, `composer audit`/`npm audit` weiterhin 0.

**Lessons Learned:**
- L12-Test-Gotcha: `$this->seed()` mit `User::factory` + `BCRYPT_ROUNDS=4`
  → „Could not verify the hashed value's configuration". Lösung: in
  API-Tests nur Domänen-Seeder aufrufen (keine User).
- `findByText`-Mehrfachtreffer-Lehre überträgt sich nicht; hier war die
  unique-Constraint auf `qualifications.description` die Falle, wenn ein
  Test bereits geseedete Werte erneut anlegt.

## 2026-05-15 — Phase 2: Generator + Belastungsindex (Projektkern)

Der zentrale, bisher fehlende Forschungsteil ist nun als Prototyp da.

**Backend:**
- `App\Services\StrainIndex` — numerische Belastungsbewertung
  (>max Dienste/verbotener Übergang = INF, isolierter freier Tag +,
  2 freie Tage −, Unterbesetzung × Defizit), config-getrieben.
- `App\Services\RosterGenerator` — greedy + Fairness: respektiert
  Abwesenheiten, max. Dienste in Folge, verbotene Übergänge,
  Soll-Dienstanzahl je `employment_ratio`, Wünsche/Präferenzen als Bonus.
- `POST /api/duties/generate` (validiert) → ersetzt Monats-Duties,
  liefert Plan + Strain-Summary. Plan bleibt manuell nachjustierbar.

**Frontend/Demo:**
- `generateRoster`-Thunk + State (`isGenerating`, `generatorSummary`).
- Mock-JS-Portierung des Generators + Strain (kongruent gehalten), inkl.
  Persistenz/Monatsersetzung.
- DutyOverview: Button „Plan automatisch generieren" + Badges
  (Belastungsindex, Dienste, regelkonform/unzulässig) + Warn-Alert.

**Verifiziert:** PHPUnit **17/17** (StrainIndex-Unit 5, Generator-Feature 3),
Frontend **7/7** (inkl. Generator-Flow), Build grün, Audits 0.

**Heuristik & bewusste Vereinfachungen:** dokumentiert in
`.claude/memory/algorithm-notes.md` (Soll-Stunden nur genähert,
Qualifikations-Mix pro Schicht noch offen, Ruhezeit über verbotene
Übergänge approximiert).

**Offen (Phase 2 Rest / Phase 3):** Feinkalibrierung der Soll-Stunden,
Qualifikations-Constraint („mind. 1 examiniert"), Abwesenheits-/
Regelwerk-UI, Auth/Rollen, Evaluations-Messung der Nachjustierungsquote.

## 2026-05-15 — Abwesenheits-UI (Phase-1-Abschluss, sichtbar bedienbar)

- `AbsencesOverview` (Liste + Löschen) und `CreateAbsence` (Formular:
  Mitarbeiter, Art, Von/Bis, Notiz) auf Basis des bestehenden
  react-bootstrap-Musters; Typ-Labels DE (Urlaub/Krankheit/Fortbildung/
  Sonstiges).
- Router-Routen `/absences`, `/absence/create`; `getAbsenceData` im
  Router-`useEffect`; Nav-Dropdown-Eintrag „Abwesenheiten".
- Frontend-Test ergänzt (Abwesenheiten-Seite zeigt geseedete Daten).

**Verifiziert:** `npm test` **8/8**, Build grün. Backend/Mock/Slice für
Absences existierten bereits (frühere Phase-1-Commits); jetzt im Demo
durchklickbar und vom Generator bereits berücksichtigt.

## 2026-05-15 — Generator-Evaluation mit realistischen Szenarien

Echten Backend-Generator gegen Seeder-Pflegedaten (Mai/2026, 31 Tage) in
3 Szenarien laufen lassen (A: 11 MA / B: 22 MA / C: 22 MA + 21-Tage-
Krankheit). Ergebnis-Matrix + Schlussfolgerungen in
`algorithm-notes.md` (Abschnitt „Evaluation").

**Positiv:** alle harten Constraints in allen Szenarien eingehalten
(0 Abwesenheits-Verletzungen, Serie ≤ 6, kein Nacht→Früh, faire
Verteilung). Unterbesetzung bei 11 MA ist nachweislich ein
Kapazitätsproblem (bei 22 MA Besetzungs-Strain 0).

**Aufgedeckte Schwäche (Iterationsziel):** Mitarbeiter-Strain steigt mit
mehr Diensten stark (B: 1472), weil das Greedy-Verfahren freie Tage
fragmentiert (viele isolierte freie Tage statt 2er-Blöcke). Hard-Regeln
& Besetzung korrekt, aber Erholungsmuster nicht optimiert → nächste
Iteration: lokale Suche/Tausch-Phase, die bei gleicher Besetzung den
Soft-Strain senkt.

**Lessons Learned:** Tinker-stdin verarbeitet Mehrzeiler unzuverlässig —
für Ad-hoc-Analysen besser ein Skript mit eigenem Laravel-Bootstrap
(`require bootstrap/app.php` + Kernel-bootstrap). Lokale sqlite nach
Szenario-Mutationen via `migrate:fresh --seed` zurückgesetzt.

## 2026-05-15 — Phase 2b: lokale Suche (2-Tausch) gegen fragmentierte freie Tage

`RosterGenerator::localSearch()` nach dem Greedy-Lauf: arbeitslast- und
besetzungserhaltender 2-Tausch (Hill-Climbing, max. 6 Pässe,
deterministisch). Tauscht Dienst-Tag von A ↔ freien Tag von B, sodass
jede Schicht-Instanz an ihrem Tag bleibt (Besetzung/Tag/Art unverändert)
und jede Person ihre Dienstanzahl behält (Fairness unverändert).
Akzeptiert nur strain-senkende, regelkonforme Tausche.

**Wirkung (gleiche Szenarien, vorher → nachher):**
- B (22 MA): **1472 → 258** (MA-Strain ≈ −82 %), Besetzung 0, regelkonform
- C (22 MA + 21-Tage-Krankheit): **1596 → 249**
- A (11 MA): 657 → 657 (kaum freie Tage; Strain wird von Besetzung 450
  dominiert, die der Tausch bewusst nicht antastet — erwartetes Verhalten)

Mock-JS-Generator kongruent erweitert (Demo zeigt denselben Effekt).
Neuer Feature-Test `test_local_search_keeps_plan_rule_compliant_and_balanced`
(≤6 in Folge, kein Nacht→Früh, ausgewogene Verteilung).

**Verifiziert:** PHPUnit **16/16** (730 Assertions), Frontend **8/8**,
Build grün. Doku: `algorithm-notes.md` (Abschnitt „Phase 2b").

**Lessons Learned:** Occupation- *und* workload-erhaltende 2-Tausche sind
der „sichere" Nachbarschaftsoperator — sie können harte Constraints &
Besetzung gar nicht erst verletzen, nur Soft-Strain verbessern. Nächste
Ausbaustufe: Simulated Annealing / 3-Tausch für tiefere Minima.

## 2026-05-15 — Phase 2c: Qualifikations-Mix (examinierte Fachkraft/Schicht)

Pflege-Realismus-Regel: ≥1 Kraft mit `required_qualification`
(`Exam. Pfleger:in`, konfigurierbar) je aktiver Schicht/Tag.

- Greedy erzwingt Fachkraft im Slot (unwichtigsten Slot ersetzen).
- Lokale Suche (2b) wurde **qualifikationsbewusst**: Tausch nur, wenn er
  keine zuvor abgedeckte Schicht/Tag ihre Fachkraft verlieren lässt.
- `StrainIndex::qualificationStrain()` + Gewicht
  `missing_required_qualification` (30); Summary-Felder
  `qualification_strain`/`missing_qualification`; UI-Badge „ohne Fachkraft".
- Mock-JS-Generator + lokale Suche kongruent erweitert.
- Tests: StrainIndex-Unit (Qual-Gewicht) + Feature
  `every_active_shift_has_an_examined_nurse_when_available`.

**Evaluation:** B/C (genug Fachkräfte) → 0 Lücken; A (nur ~3 examiniert)
→ Heuristik minimiert, meldet Restlücke ehrlich (2 Schicht-Tage,
Qual-Strain 60) = Kapazitätssignal.

**Verifiziert:** PHPUnit **20/20** (833 Assertions), Frontend **8/8**,
Build grün. Doku: `algorithm-notes.md` Abschnitt „Phase 2c".

**Lessons Learned:** Ein neuer Constraint muss in **allen** Phasen
durchgezogen werden — der erste Versuch scheiterte, weil die Phase-2b-
Lokalsuche den im Greedy erzeugten Fachkraft-Mix wieder zertauschte.
Nachbarschaftsoperatoren brauchen denselben Constraint-Guard wie die
Konstruktion.

## 2026-05-15 — Phase 2e: reproduzierbare Evaluation; SA verworfen

- `php artisan roster:evaluate {year?} {month?}` (read-only, committed)
  ersetzt die `/tmp`-Skripte: generiert + prüft harte Constraints +
  Kennzahlen + Stundenkonto; Exit 0 nur bei eingehaltenen Constraints
  (CI-tauglich). Feature-Test `EvaluateRosterCommandTest`.
- Simulated Annealing prototypisch implementiert, **bewusst wieder
  verworfen**: volle Neubewertung je Zug + nötiger 2. Lokalsuche-Polish
  ließ `generate()` auf Minuten/Monat steigen → inkompatibel mit
  interaktiver API/Demo/Tests. Sauber zurückgesetzt (nur uncommittete
  Änderungen via `git checkout`). Klar umrissener nächster Schritt:
  inkrementelle Delta-Bewertung (O(1)/Zug), dann erst Metaheuristik.

**Verifiziert:** PHPUnit **22/22** (851 Assertions), Frontend **8/8**,
Build grün.

**Lessons Learned:** Vor einer Metaheuristik muss die Zug-Bewertung
inkrementell sein — globale Re-Evaluation pro Iteration skaliert nicht
für interaktive Nutzung. Lieber eine schnelle, deterministische,
getestete Lokalsuche als eine langsame „bessere" Optimierung. Negatives
Ergebnis dokumentiert statt versteckt.

## 2026-05-15 — Phase 2d: Soll-Stunden-Kalibrierung + Stundenkonto

Grobe `Tage×ratio×5/7`-Soll-Heuristik ersetzt durch stundenbasierte
Kalibrierung: `Soll = full_time_weekly_hours × ratio/100 × Tage/7`,
`Ziel-Dienste = round(Soll / Ø-aktive-Schichtdauer)`. Nach Generierung
Ist-Stunden je MA (Σ Schichtdauern), Saldo `diff = Ist−Soll`, Upsert in
die bestehende `working_hours_diffs`-Tabelle (schließt die dokumentierte
Anbindungslücke). Neu: Response-Key `hours`, Summary `hours_imbalance`.

- `WorkingHoursDiff` `$fillable` ergänzt (updateOrCreate brauchte es).
- Mock-JS-Generator kongruent (gleiche Formel, persistiert in
  `db.working_hours_diffs`).
- Feature-Test: Soll skaliert mit Quote (50 %≈halbes Soll), 1 Saldo-Zeile
  je MA/Monat, Upsert ohne Duplikate.

**Evaluation:** A (11 MA) Index 957 (Qual 300/10 Lücken, Saldo 37.6) —
die straffere Stunden-Schranke legt die Fachkraft-Unterdeckung schärfer
offen (10 statt 2), hart weiterhin regelkonform. B/C überbesetzt →
`hours_imbalance` ≈1320 macht die zu große Personaldecke sichtbar.

**Verifiziert:** PHPUnit **21/21** (846 Assertions), Frontend **8/8**,
Build grün. Doku: `algorithm-notes.md` Abschnitt „Phase 2d".

**Lessons Learned:** Eine genauere Soll-Schranke ist kein reiner
Verbesserungs-Hebel — sie macht bestehende Kapazitätsdefizite *sichtbarer*
(Qual-Lücken A: 2→10). Das ist gewollt (ehrliches Signal), zeigt aber die
nötige Gewichts-Feinjustierung Qual↔Stunden↔Besetzung (offen).

<!-- Neue Einträge bitte hier nach diesem Marker einfügen, jeweils oben unter dem H2-Datumsblock. -->
