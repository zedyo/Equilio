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

<!-- Neue Einträge bitte hier nach diesem Marker einfügen, jeweils oben unter dem H2-Datumsblock. -->
