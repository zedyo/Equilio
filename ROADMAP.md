# Entwicklungs-Roadmap — Equilio

> Stand: Mai 2026. Diese Roadmap baut auf dem modernisierten Stand auf
> (Laravel 12 / PHP 8.2+, React 19 + Vite, 0 Sicherheitslücken) und ordnet
> die nächsten Schritte nach Wert & Aufwand. Hintergrund/Ziele:
> `.claude/memory/project-background.md`.

## Wo das Projekt steht

**Fertig:** CRUD (Mitarbeiter/Schichten/Qualifikationen/Schichtarten),
interaktiver Monatskalender, Wunsch-/Präferenzsystem mit Verletzungs-Flags,
moderner, sicherer Tech-Stack, klickbare Online-Demo, Frontend-Testnetz.

**Die zentrale Lücke:** Der wissenschaftliche Kern der Bachelorarbeit — die
**automatische Dienstplangenerierung über einen „Belastungsindex"** — ist
nicht implementiert. Alles wird manuell eingetragen.

---

## Phase 1 — Fundament für den Algorithmus (Voraussetzung)

Ohne diese Bausteine kann kein sinnvoller Generator entstehen.

1. **Abwesenheits-Modell**: Tabelle `absences` (employee_id, type =
   Urlaub/Krankheit/Fortbildung, start_date, end_date). UI zum Pflegen.
   → Grundlage für „erschwertes Szenario" aus dem Proposal.
2. **Regelwerk-Konfiguration**: arbeitsrechtliche Parameter konfigurierbar
   machen (max. Dienste in Folge, Mindestruhezeit, verbotene Übergänge wie
   Nacht→Früh, Soll-Wochenstunden je Beschäftigungsverhältnis).
3. **Datenmodell härten**: REST-Verben geraderücken (POST = Delete →
   DELETE), Validierung (FormRequests), konsistente JSON-Ressourcen.
   → ✅ Verben + FormRequest-Validierung + Status-Codes erledigt
   (2026-05-16). JSON-Resource-Normalisierung **bewusst verschoben**
   auf Phase 5 (UI-Redesign überarbeitet die Consumer ohnehin).
4. **Testdaten/Szenarien**: ein reproduzierbares „optimales" Testszenario
   als Seeder (kleine, realistische Pflege-Gruppe, ein Monat).

## Phase 2 — Belastungsindex & Generator (Kern der Arbeit)

5. **Belastungsindex-Heuristik** als eigener Service
   (`app/Services/StrainIndex.php`): bewertet eine Mitarbeiter-Schicht-
   Konstellation numerisch (Tabelle in `project-background.md`:
   7 Dienste in Folge = unzulässig, Nacht→Früh = unzulässig, 2 freie Tage
   am Stück = gut …). Designentscheidungen dokumentieren in
   `.claude/memory/algorithm-notes.md`.
6. **Generator-Service** (`app/Services/RosterGenerator.php`): erzeugt für
   einen Monat einen Vorschlag, der den Gesamt-Belastungsindex minimiert,
   Mindestbesetzung je Schichtart/Qualifikation einhält und Mitarbeiter mit
   hohem Index schont. Iterativer/heuristischer Ansatz (z. B. Greedy +
   lokale Optimierung), kein Solver-Overkill nötig.
7. **API + UI**: Endpoint „Plan generieren", Button im Kalender; der
   Vorschlag bleibt frei manuell nachjustierbar (Proposal-Vorgabe).
8. **Wunsch-/Präferenz-Berücksichtigung** im Generator (vorhandene
   `wishes`/`preferences` als weiche Constraints einfließen lassen).
9. **Evaluation**: messen, wie viel Prozent manuell nachgebessert werden
   muss (Proposal-Ziele: ≤30 % erschwert, ≤10 % als Kann-Ziel).

## Phase 3 — Produktreife & Qualität

10. **Authentifizierung & Rollen**: Login, Rollen `Leitung` / `Pflegekraft`,
    Policies; separierte UI je Rolle (Proposal-Kann-Ziel).
11. **Tests ausbauen**: PHPUnit-Feature-Tests für Generator-Heuristiken &
    API; Frontend-Tests je Feature erweitern; in CI verankern.
    → ✅ erledigt (2026-05-16). PHPUnit **51** (inkl. Stammdaten-CRUD-
    Lebenszyklus + SoftDelete und Duty-Verletzungslogik neu),
    Frontend **12**, beide in CI. Tiefere Frontend-Component-Tests
    **bewusst auf nach Phase 5** verschoben (UI-Redesign überarbeitet
    die Komponenten ohnehin → sonst Wegwerf-Tests).
12. **Echtes Backend für die Live-Demo** (optional): Laravel + Vite-
    Integration, damit die Demo nicht nur gegen das In-Browser-Mock läuft.
13. **UX-Feinschliff**: Kalender-Performance bei vielen Mitarbeitern,
    Drag&Drop, Plan-Export (PDF/Print), Mehrsprachigkeit.

## Phase 4 — Optional / Ausblick

14. Mehr-Stationen-/Mandantenfähigkeit, Reporting (Arbeitszeitsalden,
    Belastungs-Heatmaps), Tarif-/Gesetzes-Profile je Branche,
    Kalender-Sync (iCal), Benachrichtigungen.

## Phase 5 — UI/UX-Komplett-Redesign (vom Nutzer beauftragt, geplant)

> **Merker (Nutzerauftrag, 2026-05-16):** Sobald alle obigen
> Roadmap-Punkte abgearbeitet sind, folgt verbindlich dieser Punkt.

15. **Vollständiges UI/UX-Redesign.** → 🟦 **in Umsetzung**
    (2026-05-16). Analyse + UX-/Userflow-Konzept:
    `.claude/memory/ui-redesign-notes.md` / `ux-concept.md`.
    Umgesetzt (Schritte 1–7, je Commit + vitest 12/12):
    - Logo-orientiertes Indigo-Designsystem (harmonische Tonleiter
      50–900), Inter, A11y-Fokus, Politur-Layer.
    - Neue Informationsarchitektur (Dienstplan/Team/Stammdaten/Konto)
      statt irreführendem „Einstellungen"-Dropdown.
    - Redesignte Flows: sichtbarer/vorbelegter Wunsch-Flow,
      Profil-vs.-Bearbeiten, Lösch-Bestätigungen, Dienst-Picker
      (zentrale Combobox) statt Freitext.
    - Einheitliches Listen-/Formular-Muster (PageHeader/EmptyState/
      ConfirmDialog), Zurück-Links statt Breadcrumb.
    - Responsiv: fixierte erste Spalte des Boards; responsive Navbar.
    - Container headless → **keine** Eigen-Screenshots; visuelle
      Endabnahme beim Nutzer ausstehend.
    - **Offen (bewusst nach Abnahme):** Create/Edit zu *einer*
      Formular-Komponente mergen (kollidiert mit der in Phase 1.3
      verschobenen Payload-Schlüssel-Normalisierung → gemeinsam
      angehen).

---

## Empfohlene Reihenfolge

Phase 1 → 2 sind der Kern (und der eigentliche Forschungsbeitrag der
Bachelorarbeit). Phase 1.3 (REST/Validierung) kann jederzeit nebenbei
laufen. Phase 3.11 (Tests) sollte ab Phase 2 mitwachsen. Phase 3/4 erst,
wenn der Generator nachweislich funktioniert.
