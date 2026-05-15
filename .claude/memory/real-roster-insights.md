# Erkenntnisse aus echtem Real-World-Dienstplan (Excel-Analyse)

> Quelle: anonymisierte Auswertung einer echten Pflege-Dienstplan-Excel
> (Station mit 50 Bewohnern, 4 Bereiche A–D, Jan–Mai 2018). Klarnamen
> werden **nirgends** gespeichert (DSGVO). Datensatz im Code:
> `database/seeders/RealRosterSeeder.php`, Test:
> `tests/Feature/RealRosterSeederTest.php`.

## Stationsstruktur

- 50 Bewohner, aufgeteilt in 4 Wohnbereiche **A, B, C, D**.
- Examinierte Fachkräfte und Pflegehelfer:innen sind je einem Bereich
  fest zugeordnet; Präsenzkräfte/Therapeut:innen bereichsübergreifend
  (Spaltenlabel „A/B", „C/D", „-"). Das aktuelle DB-Schema hat **keine**
  Bereichsspalte → Bereich derzeit nur dokumentiert, nicht gespeichert
  (mögliche spätere Erweiterung: `employees.area`).

## Qualifikationen (aus Zellfarbe abgeleitet)

| Excel-Farbe (RGB)   | Qualifikation                  | Anzahl | exam. Tätigkeit |
|---------------------|--------------------------------|--------|-----------------|
| Hellblau 198,217,241| Examinierte Pflegefachkraft    | 11     | ja              |
| Hellrot  242,220,219| Pflegehelfer:in                | 11     | nein            |
| Dunkelviolett 179,162,199 | Auszubildende:r 3. Lehrjahr | 5  | ja (wie exam.)  |
| Helllila 230,224,236| Auszubildende:r 1. Lehrjahr    | 3      | nein            |
| Gelb 255,255,0      | FSJ-Kraft                      | 1      | nein (Hilfsarb.)|
| Grün 195,214,155    | Präsenzkraft                   | 2      | nein (Küche/Betreuung) |
| Dunkelrot 217,150,148| Beschäftigungstherapeut:in    | 3      | nein (Therapie) |

Summe: **36 Mitarbeitende**. Für die Mindestbesetzung „mind. 1
Examinierte" zählen Examinierte **und** Azubis im 3. Lehrjahr als
vollwertige Fachkraft.

## Arbeitszeit (Spalte „AZ" = tägliche Sollzeit)

| AZ (h/Tag) | employment_ratio | Anzahl MA |
|-----------:|------------------:|----------:|
| 7,8        | 100 %             | 23        |
| 6,5        | 83 %              | 1         |
| 6,0        | 77 %              | 10        |
| 5,0        | 64 %              | 1         |
| 3,45       | 44 %              | 1         |

`ratio = round(AZ / 7,8 × 100)`. Monats-SOLL = AZ × Arbeitstage;
Spalten IST/SOLL/+- im Original = Stundenkonto-Saldo (entspricht
`working_hours_diffs` im Schema).

## Dienst-Codes (Kürzel → Typ / Dauer)

**Frühdienst** (`active_duty`): F1, F2, F3, F5, F6 = 7,8 h · F7 = 6,0 h ·
F14 = 5,0 h (Präsenz/Therapie) · F10 = 3,45 h (Teilzeit).
**Spätdienst**: S1, S2, S4 = 7,8 h · S32, S33 = 6,0 h.
**Nachtdienst**: N = 8,0 h.
**Zwischendienst** (weder Früh noch Spät): G, G1, G5, G14 = 7,8 h.
**Abwesenheit/Sonderdienst** (`active_duty = false`, 0 h, kein
Besetzungsbeitrag): U = Urlaub · PA = Praxisanleitung (Azubi im Haus) ·
BS = Berufsschule (außer Haus) · LB, MS, HIT, PB, PR = Schulung/Sonder ·
A, FO, „o!" = Sonder-/Ausgleichszustände. `o` = Frei = **keine** Duty.

Codenummern (F1/F7/S33 …) kodieren im Original Bereich/Variante; fürs
Modell ist nur Typ + Dauer relevant.

## Besetzungsregeln (vom Stationsleiter genannt + im Plan sichtbar)

- **Frühdienst:** mind. **4**, besser **6** Pflegekräfte (Examiniert +
  Pflegehelfer + Azubis), davon **mind. 1 Examinierte**.
- **Spätdienst:** mind. **4** Pflegekräfte.
- **Nachtdienst:** mind. **1** Pflegekraft.
- Präsenzkräfte/FSJ/Therapeut:innen zählen **nicht** zur Pflege-
  Mindestbesetzung (nur unterstützende Tätigkeiten).

Im `RealRosterSeeder` als testbare `shift_types`-Werte abgebildet:
Früh `min 4 / opt 6`, Spät `min 4 / opt 4`, Nacht `min 1 / opt 1`,
Zwischen `min 0 / opt 1`. Typnamen folgen dem **kanonischen
System-Schema** (`Frühschicht`/`Spätschicht`/`Nachtschicht`), damit der
Generator/`StrainIndex` direkt darauf testbar ist – die Excel nutzte das
Synonym „…dienst". **Bewusst keine Festwerte fürs Produkt** –
diese Werte soll der/die Nutzer:in später selbst je Station definieren;
sie dienen hier nur als realistische Testkonstellation.

## Harte Folge-Regeln (Schichtübergänge / Ruhezeiten)

- **Nacht → Früh: verboten.** Nach Nachtdienst mind. **1–2 Tage frei**.
- **Spät → Früh: verboten.**
- **Früh → Spät: erlaubt.**
- Max. **6** Arbeitstage am Stück, danach mind. **2–3** Tage frei.
- Ziel: jeden Tag voll besetzen **und** Monatsstundenkonto nahe 0
  (nicht stark ins Plus/Minus) halten.

→ Deckt sich mit dem bestehenden `StrainIndex`/Generator (verbotene
Übergänge = `INF`, `max_consecutive_duties`, Erholungsblock-Rewards).
Der reale Plan bestätigt die Modellannahmen; lediglich die konkreten
Min/Opt-Zahlen sind stationsspezifisch (→ Nutzerkonfiguration).

## Datensatz / Anonymisierung

- 36 MA mit **fiktiven** deutschen Namen (deterministisch nach
  Einlese-Reihenfolge); Real↔Fake-Mapping wird **nicht** persistiert.
- 5 aufeinanderfolgende Quellmonate (Jan–Mai), 2779 Duty-Zeilen inkl.
  U/PA/BS … für vollständige Plan-Rekonstruktion. Beim Seeden auf ein
  **rollierendes Fenster** gemappt, das im *aktuellen* Monat endet
  (Quellmonat 5 → aktueller Monat) → der Plan ist sofort beim App-Start
  sichtbar (kein manuelles Zurücknavigieren ins Jahr 2018 nötig).
- Separater Seeder, **nicht** in `DatabaseSeeder` registriert → die
  bestehende Test-Suite/Generator bleiben unberührt.
- **Mock/Demo-Kongruenz:** identische anonymisierte Daten zusätzlich als
  `resources/js/mock/realRosterData.js`; `mockApi.js` nutzt sie (gleiche
  rollierende Umdatierung) → die klickbare Online-/Pages-Demo zeigt
  denselben Real-Datensatz. `STORAGE_KEY` auf `v2` erhöht (löst die
  alten Demo-Beispieldaten im localStorage ab).

## Offene Punkte / mögliche Erweiterungen

- `employees.area` (Wohnbereich A–D) als Schema-Feld + bereichsbezogene
  Mindestbesetzung.
- Qualifikations-gewichtete Besetzung (z. B. „mind. 1 exam. ODER Azubi
  3. LJ" statt rein zahlenbasiert).
- Stundenkonto-Anbindung (`working_hours_diffs`) aus IST/SOLL.
- FO/„o!"/„A" sind im Original nicht eindeutig dokumentiert → aktuell
  konservativ als Sonderdienst (0 h) modelliert.
- **Generator-Skalierung (gelöst):** mit dem realen Bestand (36 MA)
  brauchte `RosterGenerator::generate()` zuvor ~77 s (Hill-Climbing-
  Lokalsuche O(E²·days²), Restart bei jeder Verbesserung). Behoben durch
  (a) Memoisierung von `seqOf` in Lokalsuche **und** SA (Neuberechnung
  nur für die zwei betroffenen MA nach akzeptiertem Zug; Verhalten
  bit-identisch) und (b) `rostering.local_search_max_employees` (Default
  24): oberhalb der Schwelle wird die erschöpfende Lokalsuche
  übersprungen, allein das memoisierte, gedeckelte SA optimiert
  („best-seen" ⇒ nie schlechter als Greedy). **Ergebnis: 36 MA in
  ~0,6 s, regelkonform**, Gesamt-Index −1571. Bestehende Tests (≤22 MA)
  laufen unverändert auf dem Lokalsuche-Pfad.
