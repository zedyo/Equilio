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

<!-- Neue Einträge bitte hier nach diesem Marker einfügen, jeweils oben unter dem H2-Datumsblock. -->
