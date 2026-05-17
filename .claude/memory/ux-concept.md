# UX-Konzept & Userflow — Equilio Redesign (Phase 5)

Stand: 2026-05-16. Auftrag des Nutzers: Redesign über Farben hinaus —
Struktur der Seite, Formulare, Navigation und das **gesamte
Nutzungsverhalten**. Dieses Dokument ist das Konzept; Umsetzung erfolgt
danach iterativ und nach Freigabe.

---

## 1. Rollen & Kernaufgaben

| Rolle | Will im Kern … | Heute Wege/Klicks |
|---|---|---|
| **Leitung** | Monatsplan erzeugen, prüfen, manuell justieren; Team/Schichten/Abwesenheiten pflegen; Wünsche & Soll/Ist im Blick behalten | viele, verstreut |
| **Pflegekraft** | eigenen Plan sehen, Wünsche & Präferenzen eintragen | ok, aber Wunsch-Flow umständlich |

Primäre Aufgaben (nach Häufigkeit):
1. Leitung: Plan ansehen & einzelne Dienste ändern (täglich)
2. Leitung: Plan automatisch generieren (monatlich)
3. Pflegekraft: Wunsch eintragen (laufend)
4. Leitung: Abwesenheit/Mitarbeiter pflegen (gelegentlich)

---

## 2. Ist-Zustand: Reibungspunkte (aus Code verifiziert)

1. **Wunsch eintragen ist „versteckt"**: Der „+ Wunsch"-Button
   erscheint nur bei `onMouseEnter` über dem Namen (Hover) → auf
   Touch/Mobile **unauffindbar**, generell nicht entdeckbar. Im Modal
   wird die Mitarbeiter:in **erneut** ausgewählt (obwohl man aus genau
   deren Zeile kam); Wunschtag steht auf „heute" statt auf dem gerade
   betrachteten Monat.
2. **„Bearbeiten" führt nicht zum Bearbeiten**: In der Team-Tabelle
   öffnet „Bearbeiten" `/employee/show/:id` (read-only Detailseite);
   erst dort ein zweiter Button „Daten bearbeiten" → `/employee/edit`.
   Doppelter Weg, irreführendes Label.
3. **Dienst-Eingabe als blanker Freitext**: Zelle ist ein `<input>`,
   in das das Kürzel (z. B. `F1`) getippt werden muss. Kein Picker,
   keine Vorschläge, kein Inline-Fehler — man muss alle Kürzel kennen.
4. **Informationsarchitektur flach & falsch benannt**: Alle
   Stammdaten (Team, Qualifikationen, Schichten, Schichtarten,
   Abwesenheiten) hängen in **einem** Dropdown „Einstellungen".
   Stammdatenpflege ist keine „Einstellung". Kein Gruppieren.
5. **Kein Aufgaben-Einstieg**: Die zentrale Aktion „Plan generieren"
   ist ein Button irgendwo über dem Board; kein klarer Handlungsraum,
   kein Status („wie gut ist der Plan?", „was fehlt?").
6. **Inkonsistente Muster**: gemischte Button-Varianten
   (`outline-success/secondary/danger/primary`), Inline-Styles,
   `<h1>… loading</h1>` als Ladezustand, Breadcrumb-Präfix
   „Einstellungen:".
7. **Mobil unbenutzbar**: Hover-Aktionen, breites Freitext-Raster,
   tabellenlastige Detailseiten.

---

## 3. Ziel-Informationsarchitektur

Statt „Dienstplan + Einstellungs-Dropdown":

```
Topbar:  [Equilio-Logo]   Dienstplan   Team   Stammdaten▾        [Konto▾]
                                                 ├ Schichten
                                                 ├ Schichtarten
                                                 ├ Qualifikationen
                                                 └ Abwesenheiten

Pflegekraft-Topbar: [Logo]  Mein Plan   Meine Wünsche   [Konto▾]
```

- **Dienstplan** = Arbeitsbereich (Default). **Team** als eigener
  Top-Punkt (häufig genutzt, eigene Aufgabe). **Stammdaten** gruppiert
  die selten geänderten Konfigurations-Entitäten. „Einstellungen"
  entfällt als irreführender Sammelbegriff.
- Konsistenter Seitenrahmen: Topbar (sticky) → optionale
  Kontextleiste (Titel + Primäraktion + Status) → Inhalt. Keine
  Breadcrumb-Ketten mehr für eine 2-Ebenen-App; stattdessen klarer
  Seitentitel + „Zurück"-Affordanz.

---

## 4. Redesignte Kern-Userflows

### 4.1 Plan generieren & justieren (Leitung, Hauptflow)

**Heute:** Button + Badges über dem Board, dann frei tippen.

**Neu:**
1. Dienstplan öffnet mit **Kontextleiste**: Monatsnavigation links,
   Primärbutton „Plan automatisch erstellen" rechts, daneben ein
   **Status-Chip-Set** (Belastungsindex, Dienste, „ohne Fachkraft: n",
   regelkonform/ unzulässig) — schon sichtbar, nicht erst nach Klick.
2. Nach Generierung: dieselbe Leiste zeigt Ergebnis; unzulässige
   Konstellationen als **eine** klare Warnleiste mit „n Probleme"
   und Sprung zur ersten betroffenen Zelle.
3. **Dienst setzen** nicht mehr blind tippen: Klick auf Zelle öffnet
   einen kompakten **Schicht-Picker** (Kürzel + Farbe + Name,
   tastaturbedienbar, Tippen filtert weiter → schnell *und*
   fehlerfrei). Leeren = „frei". Inline-Markierung für
   Wunsch/Präferenz-Verletzung bleibt, mit Tooltip „Warum rot?".
4. Zelle zeigt bei Wunsch dezent den Wunsch als Geist-Text (bereits
   vorhanden) — Konzept behält das bei.

### 4.2 Wunsch eintragen (beide Rollen)

**Heute:** Hover → Button → Modal mit redundanter MA-Auswahl.

**Neu:**
- Einstieg **immer sichtbar**: (a) Pflegekraft: Button „+ Wunsch" in
  der Kontextleiste von „Meine Wünsche"; (b) Leitung: Aktionssymbol
  fest in der Mitarbeiterzeile (kein Hover) **oder** Klick auf eine
  künftige Zelle → „als Wunsch hinterlegen".
- Modal **vorbelegt**: Mitarbeiter:in fix aus dem Kontext (kein
  erneutes Auswählen; bei Leitung-Direktwahl vorausgewählt &
  änderbar). Tag = aktuell betrachteter Monat, nicht „heute".
  Reihenfolge: Tag → Wunschschicht (Schicht-Picker wie 4.1).
- Nach Speichern: Modal zu, Liste aktualisiert sich selbst (heute
  `setTimeout(400)`-Hack → durch sauberes Refetch ersetzen).

### 4.3 Mitarbeiter:in bearbeiten (Leitung)

**Heute:** „Bearbeiten" → Read-only-Seite → „Daten bearbeiten" → Edit.

**Neu:**
- Team-Tabelle Zeilenaktionen: **„Profil"** (Detail inkl. Wünsche/
  Präferenzen) und **„Bearbeiten"** (direkt das editierbare Formular)
  — getrennt, korrekt benannt, je ein Klick. Löschen mit
  Bestätigungs-Dialog (heute sofortiges Löschen ohne Rückfrage).
- Detailseite: Felder nicht mehr als „disabled Form.Control" (sieht
  aus wie kaputtes Formular), sondern als saubere **Definitionsliste**
  (Label/Wert). Bearbeiten ist ein expliziter Modus/Seite.

### 4.4 Stammdaten (Schichten/Qualifikationen/Schichtarten/Abwesenheiten)

Einheitliches **Listen-Muster**: Seitentitel + „+ Neu" (primär) +
Suchfeld; Tabelle/Karten mit Zeilenaktionen „Bearbeiten/Löschen";
Create/Edit als **gleiches Formular** (eine Komponente, Modus
create|edit) statt heute getrennter, divergierender Create-/Update-
Komponenten. Löschen immer mit Bestätigung.

---

## 5. Komponenten-/Interaktions-Prinzipien

- **Aktionen sichtbar, nicht auf Hover.** Touch-first denken.
- **Eine Primäraktion pro Screen** (gefüllter Indigo-Button), Rest
  sekundär (outline) / tertiär (link). Schluss mit `outline-success`
  vs. `primary` Wildwuchs.
- **Picker statt Frei-Eingabe**, wo es eine endliche Liste gibt
  (Schichten).
- **Bestätigung vor destruktiv** (Löschen Mitarbeiter/Schicht/…).
- **Leerzustände & Ladezustände** als gestaltete Platzhalter (Skeleton/
  „Noch keine Wünsche – jetzt anlegen"), nicht `... loading`.
- **Statt Breadcrumb**: Seitentitel + Kontextleiste; konsistenter
  `PageHeader` (Titel, Beschreibung, Primäraktion, Status-Chips).
- **Responsiv**: Tabellen → auf Mobil Karten-/Stapel-Layout; Board
  horizontal scrollbar mit fixierter Mitarbeiterspalte.

---

## 6. Harmonisierte Farbabstufungen (Logo-Indigo)

Wunsch: am Logo orientierte, **harmonisch abgestufte** Palette statt
nur 4 Stützwerte. Tonleiter (vom Logo abgeleitet, gleichmäßiger
Helligkeitsverlauf):

| Token | Hex | Verwendung |
|---|---|---|
| `brand-50`  | `#EEF0FF` | Flächen, Hover-BG, Login-Verlauf (Logo-BG) |
| `brand-100` | `#E0E2FE` | Badges-BG, aktive Listenzeile |
| `brand-200` | `#C7CBFB` | Trenner/zarte Ränder |
| `brand-300` | `#A5ABF7` | Disabled-Primär, Charts |
| `brand-400` | `#818CF8` | Fokus-Ring, Hover-Akzent (Logo) |
| `brand-500` | `#6366F1` | Sekundär-Akzent, Links-Hover (Logo) |
| `brand-600` | `#4F46E5` | **Primary** (Buttons/Links, Logo-Hauptton) |
| `brand-700` | `#4338CA` | Button-Hover |
| `brand-800` | `#3730A3` | Button-Active/gedrückt (Logo dunkel) |
| `brand-900` | `#312E81` | Text auf Tint, starke Akzente |

Neutrale bleiben Slate (bereits gesetzt). Status (success/warning/
danger) bleiben, aber leicht entsättigt für ruhigeres Gesamtbild.
Verbindlich als CSS-Custom-Properties + Sass-Map → konsistente
Nutzung statt Einzel-Hex im Code.

---

## 7. Umsetzungsreihenfolge (nach Freigabe)

1. Farb-Tonleiter + `PageHeader`/`ConfirmDialog`/Empty-State-Primitive.
2. Navigation/IA umbauen (Topbar-Struktur, „Einstellungen" → Team +
   Stammdaten▾).
3. Wunsch-Flow (sichtbarer Einstieg, vorbelegtes Modal, Refetch).
4. Mitarbeiter-Flow (Profil vs. Bearbeiten, Definitionsliste,
   Lösch-Bestätigung).
5. Dienst-Picker statt Freitext-Zelle. *(Umsetzung: aus Performance-/
   Robustheitsgründen über dem perf-sensiblen Board als **eine**
   zentrale native Combobox/`<datalist>` realisiert — Tippfilter +
   Auswahl + kein Auswendiglernen, tastaturbedienbar — statt
   hunderter schwerer Einzel-Popover.)*
6. Stammdaten auf einheitliches Listen-/Formular-Muster.
7. Responsiver Durchgang (Tabellen→Karten, fixierte MA-Spalte).

Jeder Schritt: eigener Commit, vitest grün, visuelle Abnahme durch
Nutzer (Container headless → keine Eigen-Screenshots möglich).
