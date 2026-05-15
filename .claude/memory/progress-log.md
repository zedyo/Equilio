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

<!-- Neue Einträge bitte hier nach diesem Marker einfügen, jeweils oben unter dem H2-Datumsblock. -->
