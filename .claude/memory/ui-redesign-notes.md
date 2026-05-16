# UI/UX-Redesign — Analyse & Designentscheidungen (Phase 5)

Stand: 2026-05-16. Nutzerauftrag: vollständiges, modernes, alltagstaugliches
und responsives Redesign. Container ist headless → **keine** Chrome-Live-
Exploration möglich; Analyse erfolgt code-/stilbasiert, funktionale
Verifikation über die vitest/jsdom-Smoke-Suite. Visuelle Endabnahme beim
Nutzer (lokal `npm run dev` / Pages-Demo).

## Ist-Zustand (Optimierungspotenzial)

| Bereich | Befund |
|---|---|
| Farbpalette | Legacy Laravel-2017-Palette (`$blue:#3490dc`, `$indigo`, …) in `_variables.scss`; `$primary` nicht gesetzt → Bootstrap-Default-Blau wirkt beliebig, kein Markenbezug. |
| Typografie | Nunito via mehrfachem Google-Fonts-`@import` (ineffizient); keine Typo-Skala. |
| Shell | `NavigationBar` mit Inline-`margin:0 5rem` → **nicht responsiv**, bricht mobil; kein Sticky, kein Toggle. |
| Login | Inline-Styles, `100vh`-Flex, schmucklose Card. |
| Hauptscreen `DutyOverview` | Funktional dichte Matrix, aber flache Optik: dünne Section-Header, kein Sticky-Tageskopf, Buttons/Badges Default-Bootstrap. |
| CRUD-Seiten | Default-`Table`/`Card`, Breadcrumb, `outline-success`-Buttons — uneinheitliche Button-Varianten quer durch die App. |
| Allgemein | Viele Inline-`style`-Objekte, kein gemeinsames Token-/Komponenten-Layer; `shared/Button.jsx` ist toter Stub. |
| A11y | Keine `:focus-visible`-Stile, Kontraste teils schwach (Default-Grautöne). |

## Designentscheidung

Da die gesamte App auf **React-Bootstrap** sitzt, wird zentral über die
**Bootstrap-Sass-Variablen** (vor dem Bootstrap-Import) ein kohärentes
Theme gesetzt + ein globaler Politur-Layer. Das modernisiert alle
Komponenten gleichzeitig, ohne ~45 Markups umzuschreiben (geringes
Regressionsrisiko — wichtig ohne visuelle Verifikation). Markup-Eingriffe
nur dort, wo nötig (Shell-Responsivität, Login-Rahmen, Kern-Board-SCSS).

**Designsystem (Tokens) — am Equilio-Logo ausgerichtet (Nutzerwunsch):**
- Logo ist Indigo-monochrom: `#3730A3 / #4F46E5 / #6366F1 / #818CF8 /
  #EEF0FF`. Daraus die Marke abgeleitet:
  - Primary `#4F46E5` (dominanter Logo-Balken), Hover/Active `#3730A3`,
    heller Tint `#EEF0FF` (Dropdown-Hover/Flächen), Fokus-Ring aus
    `#818CF8`.
- Akzent/Info Blau `#0284c7`; Status success `#16a34a`,
  warning `#d97706`, danger `#dc2626`.
- Neutrale: Slate-Skala; Text `#1e293b`, Border `#e2e8f0`, App-BG
  `#f6f8fa`, Flächen weiß.
- Typo: **Inter** (variabel, exzellent für dichte Plan-Tabellen),
  System-Fallback; ein einziger Fonts-Request.
- Radius `.5rem`, weiche, niedrige Schatten, ruhige Hover-States.
- Sichtbarer `:focus-visible`-Ring (A11y), AA-Kontraste.

**Abschnitt 1 umgesetzt (2026-05-16):** Theme-Override + globaler
Politur-Layer (Fokus/Navbar-Sticky/Cards/Tabellen/Dropdown/Scrollbars),
Login mit Logo-Tint-Verlauf, Navbar voll responsiv (Toggle/Collapse,
kein `margin:0 5rem` mehr), Kern-Board als erhöhte Fläche mit ruhiger
Sektions­überschrift. Build + Frontend-Suite (12) grün. Offen:
CRUD-/Detail-Feinschliff, gezielter Mobile-Durchgang.

Inkrementell, jeweils committet + Suite grün. Reihenfolge: (1) Theme +
Global-Layer + Shell + Login + Kern-Board-SCSS, danach (2) CRUD-/Detail-
Feinschliff, (3) Responsive-/Mobile-Durchgang.
