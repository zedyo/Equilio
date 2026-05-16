# Algorithmus-Notizen — Belastungsindex & Generator

> Kern der Bachelorarbeit. Hier werden Designentscheidungen, Heuristik und
> bewusste Vereinfachungen festgehalten. Stand: Mai 2026 (Phase 2 Start).

## Ziel

Aus Stammdaten (Mitarbeiter, Qualifikationen, Schichten, Schichtarten,
Abwesenheiten, Wünschen/Präferenzen) automatisch einen Monats-Dienstplan
als **Vorschlag** erzeugen, der den Gesamt-**Belastungsindex** minimiert und
die Mindestbesetzung je aktiver Schichtart einhält. Der Plan ist anschließend
manuell nachjustierbar (Proposal-Vorgabe).

## Belastungsindex (`App\Services\StrainIndex`)

Bewertet eine Mitarbeiter-Tagessequenz + die Tagesbesetzung numerisch.
Höher = schlechter. `INF` = unzulässige Konstellation.

Regeln/Gewichte stammen aus `config/rostering.php`:

| Konstellation                                   | Bewertung (Gewicht)          |
|-------------------------------------------------|------------------------------|
| Dienste in Folge > `max_consecutive_duties`     | `INF` (unzulässig)           |
| verbotener Übergang (z. B. Nacht→Früh)          | `INF` (unzulässig)           |
| genau 3 Dienste am Stück (2 + ein 3.)           | `third_consecutive_duty` (−) gut |
| isolierter freier Tag (Dienst, frei, Dienst)    | `isolated_free_day` (+)      |
| 2 freie Tage am Stück                           | `two_free_days_in_row` (−) gut |
| Schicht unter `min_occupation` besetzt          | `understaffed_shift` × Defizit |

Nur Schichtarten mit `active_duty = true` zählen als „Dienst". Abwesenheiten
(`absences`, Datumsbereich) sperren den Tag — dort darf nicht verplant werden;
ein Dienst an einem Abwesenheitstag ist `INF`.

Wunsch/Präferenz fließen weich ein: ein Dienst, der einen konkreten
Tageswunsch verletzt, erhöht den Index leicht (`wish_injury`-Logik des
Backends bleibt davon unberührt; der Generator versucht sie zu vermeiden).

## Generator (`App\Services\RosterGenerator`)

Heuristisch (greedy + Fairness), **kein** exakter Solver — bewusste
Prototyp-Entscheidung (Proposal: „Vorschlag", nicht Optimum):

1. Soll-Dienstanzahl je MA ≈ `Arbeitstage × employment_ratio/100 × 5/7`
   (grobe Näherung; Feinkalibrierung ist späterer Schritt).
2. Tageweise: für jede aktive Schichtart (Reihenfolge: Früh, Spät, Nacht)
   bis `min_occupation` (Ziel `opt_occupation`) Mitarbeiter zuteilen.
3. Kandidatenfilter pro Tag: nicht abwesend, noch kein Dienst am Tag,
   `max_consecutive_duties` nicht überschritten, kein verbotener Übergang
   zum Vortag, Soll-Dienstanzahl noch nicht erreicht.
4. Auswahl unter Kandidaten: geringste bisherige Dienstlast zuerst
   (bereits Belastete werden geschont), Wunsch/Präferenz als Bonus.
5. Tage ohne Dienst = frei.

Determinismus: bei Gleichstand stabile Sortierung nach `employee_id`, damit
Ergebnisse reproduzierbar/testbar sind (Proposal: Szenarien wiederholbar).

## Bewusste Vereinfachungen / offene Punkte

- Soll-Stunden nur näherungsweise (kein exakter Tarif-/Saldoabgleich).
- Qualifikations-Mix pro Schicht (z. B. „mind. 1 examiniert") noch nicht
  modelliert — `min_occupation` ist aktuell rein zahlenbasiert.
- Ruhezeit in Stunden (`min_rest_hours`) wird über die verbotenen
  Schichtart-Übergänge angenähert, nicht zeitgenau gerechnet.
- Mock-Demo enthält eine vereinfachte JS-Portierung des Generators
  (kein PHP im Browser); Heuristik bewusst kongruent gehalten.

## Evaluation mit realistischen Szenarien (Mai 2026)

Getestet gegen Seeder-Pflegedaten (Mai/2026, 31 Tage), 3 Szenarien:

| Szenario | MA | Dienste | Belastungsindex (MA / Bes.) | Regelkonform | Unterbesetzung |
|----------|----|---------|-----------------------------|--------------|----------------|
| A Ausgangslage | 11 | 241 | 657 (207 / 450) | ja | Früh 5, Spät 8, Nacht 9 von 31 Tagen |
| B aufgestockt | 22 | 310 | 1472 (1472 / 0) | ja | keine |
| C B + 21-Tage-Krankheit | 22 | 310 | 1596 (1596 / 0) | ja | keine |

**Harte Constraints in allen Szenarien eingehalten:** 0 Dienste während
Abwesenheiten, längste Serie = 6 (Grenze), keine Nacht→Früh-Übergänge,
faire Verteilung.

**Erkenntnis A→B:** Unterbesetzung in A ist ein **Kapazitätsproblem**
(11 MA decken Min-Bedarf nicht voll), kein Algorithmusfehler — mit 22 MA
ist die Mindestbesetzung jeden Tag erfüllt (Besetzungs-Strain 0).

**Aufgedeckte Schwäche (Greedy allein):** Der Mitarbeiter-Strain stieg mit
mehr Diensten stark (B: 1472), weil Greedy freie Tage fragmentiert
(„isolierte freie Tage" +8 statt „2 freie Tage am Stück" −5).

## Phase 2b — lokale Suche (2-Tausch), implementiert

`RosterGenerator::localSearch()` läuft nach dem Greedy-Lauf:
arbeitslast- **und** besetzungserhaltender 2-Tausch (Hill-Climbing) —
tauscht einen Dienst-Tag von A mit einem freien Tag von B (B arbeitet an
A's freiem Tag, A ist an B's Dienst-Tag frei). Jede Schicht-Instanz
bleibt an ihrem Tag → Besetzung pro Tag/Art unverändert; jede Person
behält ihre Dienstanzahl → Fairness unverändert. Akzeptiert nur Tausche,
die den Soft-Strain senken und keine `INF`-Konstellation erzeugen
(max. 6 Pässe, deterministische Reihenfolge nach `employee_id`).

**Wirkung (gleiche Szenarien, nach Phase 2b):**

| Szenario | MA | Belastungsindex vorher → nachher | Besetzung | Regelkonform |
|----------|----|----------------------------------|-----------|--------------|
| A | 11 | 657 → 657 (Soft 207, dominiert von Besetzung 450) | unverändert | ja |
| B | 22 | **1472 → 258** (MA-Strain ≈ −82 %) | 0 (unverändert) | ja |
| C | 22 | **1596 → 249** | 0 (unverändert) | ja |

A bleibt gleich: bei Unterbesetzung gibt es kaum freie Tage zum Bündeln,
und der dominante Anteil ist der Besetzungs-Strain (Kapazität), den der
Tausch bewusst nicht antastet. B/C zeigen den eigentlichen Effekt.

Offen: Simulated Annealing / größere Nachbarschaften (3-Tausch) für noch
tiefere Minima; Reproduzierbar via `/tmp`-Analyseskripte bzw. einem
späteren `php artisan roster:evaluate`.

## Phase 2c — Qualifikations-Mix (examinierte Fachkraft je Schicht)

Pflege-Realismus: je aktiver Schicht und Tag muss mind. eine Kraft mit
`config('rostering.required_qualification')` (`Exam. Pfleger:in`)
eingeplant sein. Umsetzung:

- **Greedy:** enthält die Slot-Auswahl keine Fachkraft, wird der
  unwichtigste Slot durch den bestplatzierten qualifizierten Kandidaten
  ersetzt (sofern verfügbar).
- **Lokale Suche (2c-Erweiterung):** ein Tausch wird zusätzlich nur
  akzeptiert, wenn er keine zuvor abgedeckte Schicht/Tag-Zelle ihre
  Fachkraft-Abdeckung verlieren lässt (`covAd`/`covBe`-Guard).
- **Strain/Reporting:** Restlücken gehen mit `missing_required_qualification`
  (30/Schicht-Tag) in den Index ein; Summary-Felder
  `qualification_strain`, `missing_qualification`; UI-Badge „ohne Fachkraft".

**Evaluation (gleiche Szenarien, jetzt inkl. Qualifikation):**

| Szenario | MA | Index (MA / Bes. / Qual.) | ohne Fachkraft | regelkonform |
|----------|----|---------------------------|----------------|--------------|
| A | 11 | 717 (207 / 450 / 60) | 2 Schicht-Tage | ja |
| B | 22 | 258 (258 / 0 / 0) | 0 | ja |
| C | 22 | 264 (264 / 0 / 0) | 0 | ja |

Erkenntnis: bei genügend Fachkräften (B/C) **lückenlose** Abdeckung; bei
knapper Examinierten-Decke (A: nur ~3 examiniert für 3 aktive Schichten
× 31 Tage) minimiert die Heuristik und **meldet die Restlücke ehrlich**
(2 Schicht-Tage) statt sie zu verstecken — wieder ein Kapazitätssignal,
kein Algorithmusfehler.

## Phase 2d — Soll-Stunden-Kalibrierung + Stundenkonto

Statt der groben `Tage × ratio × 5/7`-Heuristik wird die Soll-Dienstanzahl
aus **Soll-Stunden** abgeleitet: `Soll = full_time_weekly_hours × ratio/100
× Tage/7`; `Ziel-Dienste = round(Soll / Ø-aktive-Schichtdauer)`. Nach der
Generierung wird je MA das **Ist** (Σ Schichtdauern) berechnet, der
Saldo `diff = Ist − Soll` gebildet und in die bestehende Tabelle
`working_hours_diffs` upserted (schließt die dokumentierte Anbindungs-
Lücke). Summary-Feld `hours_imbalance` (Σ |diff|), Response-Key `hours`.

**Evaluation (gleiche Szenarien, jetzt inkl. Stundenkonto):**

| Szenario | MA | Index (MA/Bes./Qual.) | ohne Fachkraft | Σ\|Stunden-Saldo\| |
|----------|----|-----------------------|----------------|--------------------|
| A | 11 | 957 (207/450/300) | 10 | 37.6 |
| B | 22 | 186 (186/0/0) | 0 | 1319.6 |
| C | 22 | 134 (134/0/0) | 0 | 1319.6 |

Erkenntnisse / ehrliche Befunde:
- Die exaktere Soll-Stunden-Schranke deckelt Dienste straffer; in A
  (~3 examinierte Kräfte) treten dadurch die Fachkraft-Lücken **deutlicher
  zutage** (10 statt vorher 2 Schicht-Tage) — kein Korrektheits-Regress
  (hart regelkonform), sondern ein schärferes Kapazitätssignal.
- B/C sind **überbesetzt** (22 MA, aber nur 310 opt-Dienste): jeder
  arbeitet weit unter Soll → großes `hours_imbalance` (≈1320). Genau das
  soll die Kennzahl sichtbar machen (Personaldecke vs. Bedarf).
- Kalibrierungs-Wechselwirkung dokumentiert; Feinjustierung der Gewichte
  (Qual. vs. Stunden vs. Besetzung) bleibt bewusster offener Punkt.

## Phase 2e — Reproduzierbare Evaluation + SA-Versuch (verworfen)

**`php artisan roster:evaluate {year?} {month?}`** (committed, read-only)
ersetzt die früheren `/tmp`-Skripte: generiert einen Vorschlag und prüft
harte Constraints (Abwesenheiten, max. Serie, Nacht→Früh,
Mindestbesetzung, Fachkraft-Abdeckung) + Kennzahlen + Stundenkonto;
Exit-Code 0 nur bei eingehaltenen harten Constraints (CI-tauglich).
Feature-Test: `EvaluateRosterCommandTest`.

**Simulated Annealing — evaluiert und bewusst verworfen:** Ein SA-Pass
auf derselben sicheren 2-Tausch-Nachbarschaft wurde prototypisch
implementiert, aber wieder entfernt: die volle Neubewertung pro Zug plus
der nötige zweite Lokalsuche-Polish ließ die `generate()`-Laufzeit
unverhältnismäßig (Mehrere Minuten je Monat) ansteigen — inkompatibel mit
interaktiver API/Demo und Test-Suite. Festgehalten als bewusste
Engineering-Entscheidung: tiefere Metaheuristik erst sinnvoll mit
inkrementeller Delta-Bewertung (O(1) statt O(Tage) je Zug) — offener,
klar umrissener nächster Schritt, kein Blocker für den Prototyp.

## Phase 2f — Inkrementelle Δ-Bewertung (Fundament für Metaheuristik)

`StrainIndex::sequenceStrainDelta($old, $new, $changedDays, $days)`
liefert `strain(neu) − strain(alt)` ohne Vollberechnung: betroffene Tage
werden links/rechts bis zu einem in BEIDEN Sequenzen freien Tag erweitert
(+2 Polsterung), so dass keine Serie/kein Übergang/kein Freitag-Pattern
die Fenstergrenze kreuzt. Außen- und Randterme sind alt/neu identisch und
kürzen sich im Δ exakt heraus →
`Δ = Σ_Fenster [ ESS(Ausschnitt_neu) − ESS(Ausschnitt_alt) ]`
mit der bereits getesteten `employeeSequenceStrain`. Aufwand ≈
O(Serienlänge) statt O(Monatslänge); INF korrekt propagiert.

Korrektheit per Property-Test (`StrainIndexTest`): 400 Zufallssequenzen
× 1–3 Änderungen, Δ stimmt exakt mit Vollberechnung überein (inkl.
INF-Fälle). `RosterGenerator::localSearch()` nutzt jetzt die Δ-Bewertung
als Akzeptanzkriterium statt vier voller Strain-Berechnungen.

Wirkung: `generate()` ~0.7 s (11 MA) / ~1.1 s (22 MA), Verhalten
unverändert (alle Constraints/Tests grün). Dies ist die fehlende
Voraussetzung für eine schnelle Metaheuristik (SA/3-Tausch): pro Zug
nur noch O(Fenster)-Bewertung zweier Mitarbeiter — der frühere
SA-Versuch scheiterte genau an der O(Monat)-Vollbewertung je Zug.

## Phase 2g — Simulated Annealing (auf Δ-Bewertung, jetzt performant)

Nach Greedy + Hill-Climbing-Lokalsuche läuft `RosterGenerator::
simulatedAnnealing()`: dieselbe sichere 2-Tausch-Nachbarschaft
(Besetzung/Tag/Art, Dienstanzahl je MA, Fachkraft-Abdeckung invariant),
Zugbewertung über `StrainIndex::sequenceStrainDelta` (O(Serienlänge)),
Metropolis-Akzeptanz `exp(-Δ/T)` mit geometrischer Abkühlung. Fester
Seed (`config rostering.annealing.seed`) → deterministisch. Die je
gesehene beste Lösung wird gesichert → Ergebnis **nie schlechter** als
die Eingabe (lokale Suche).

**Wirkung (Seeder-Daten, Mai/2026):** 22 MA aufgestockt: Gesamt-Index
**258 → −707** (freie Tage zu 2er-Erholungsblöcken gebündelt; Besetzung
0 und Qualifikation 0 unverändert, regelkonform). 11 MA: unverändert
(kapazitätsgebunden, kaum freie Tage). `generate()` ~0,8 s (11 MA) /
~1,6 s (22 MA) — interaktiv. Der frühere SA-Fehlschlag (Minuten/Monat)
ist durch die inkrementelle Δ-Bewertung (Phase 2f) behoben.

Tests: `test_simulated_annealing_is_deterministic_and_never_worse`
(Determinismus, SA ≤ ohne-SA, Besetzung/Qual invariant). Mock-JS-
Generator kongruent (mulberry32-PRNG statt mt_rand).

Damit ist die im Proposal als Kern genannte automatische, bewertete
Plangenerierung inkl. Metaheuristik vollständig als getesteter,
reproduzierbarer Prototyp umgesetzt. Offen: Gewichts-Feinjustierung,
Phase 3 (Auth/Rollen).

## Phase 2i — Stunden-/Wunsch-/Präferenz-Term im Objektiv

`RosterGenerator::employeeExtraStrain()` ergänzt die Sequenz-Belastung
um drei Mitarbeiter-bezogene Terme (config `rostering.*`):
- **monthly_hours_deviation** (1.5/h): Strafe je Stunde |Ist−Soll| →
  Mitarbeiter werden auf ihre Monatsstunden geplant (Auslastung).
- **wish_violation** (25/Tag): hohe Strafe je nicht erfülltem
  Tages-Wunsch → Wünsche werden stark bevorzugt erfüllt (Work/Life).
- **preference_miss** (0.5/Dienst): sanfte Strafe je Dienst ohne
  passende hinterlegte Schicht-Präferenz (nur wenn MA Präferenzen hat).

Reine Funktion von `$assigned[$empId]` → wie `seqOf` memoisiert
(`$extraCache`, Neuberechnung nur für die 2 betroffenen MA pro
akzeptiertem 2-Tausch). Fließt additiv in das Δ der lokalen Suche
**und** des SA ein (INF bleibt INF) sowie in `total_strain`; neue
Summary-Felder `hours_strain`, `wish_violations`, `preference_misses`.
Bestehende StrainIndex-Unit-Tests unberührt (Term lebt im Generator,
nicht in `employeeSequenceStrain`). PHPUnit 26/26 weiterhin grün.

## Phase 2i — Schichtfarben

Frühschicht = Orange `#f59e0b`, Spätschicht = Blau `#3b82f6`
(RealRosterSeeder + Mock `realRosterData.js`, kongruent). Nacht/
Zwischen/Sonder unverändert.

## Phase 2j — 3-stufige Präferenzen (preferred/valid/blocked)

Präferenzen sind jetzt dreistufig je MA/Schicht:
- **preferred**: bevorzugt (Greedy-Bonus + kein `preference_miss`).
- **valid** (kein Datensatz): neutral, erlaubt.
- **blocked**: harte Restriktion – Greedy überspringt den Kandidaten,
  `employeeExtraStrain` liefert `INF` (Lokalsuche/SA lehnen ab),
  `buildResult` markiert `forbidden`. Wird nie vergeben.

DB: `preferences.level` (Migration, Default 'preferred' für Altbestand).
Controller `create` macht ein 3-Wege-Upsert (valid = Datensatz löschen).
Slice/Reducer upsert nach (employee_id, shift_id). Mock-API kongruent
(immutabilitätssicher – Antworten sind Kopien, da Redux/Immer die
Antwort einfriert; in-place-Mutation der internen db-Arrays vermieden).
UI: segmentierte 3-Wege-Steuerung je Schicht (Gesperrt/Erlaubt/
Bevorzugt) statt Schalter, gruppiert nach Schichtart. Frontend-Test
deckt die End-to-End-Nutzbarkeit ab (Klick → Mock → Slice → aktiv).

## Phase 2k — manual_only, belastungsabhängige Gewichtung, Unterstunden

**manual_only (Schicht-Flag):** `shifts.manual_only` (Migration, Model-
Cast, ShiftController, Create/UpdateShift-Switch). Sonderdienst/
Abwesenheit (FO, U, BS, PA …) ist im Seeder manual_only=true.
DutyController.generate lädt bestehende manual_only-Duties des Monats
und gibt sie als `$locked` an den Generator: vorbelegt, MA an dem Tag
belegt, Greedy/Lokalsuche/SA verändern sie nie, buildResult gibt sie
unverändert mit aus. Mock kongruent (lockedByDay, Persist behält sie).

**Belastungsabhängige Gewichtung:** nach dem Greedy-Lauf wird je MA
`employeeSequenceStrain` berechnet; Gewicht `m = 1 + k·min(strain/
scale, cap)` (config `strain_adaptive`, k=1, scale=30, cap=2 → m≤3).
`m` skaliert in Lokalsuche/SA das Sequenz-Δ je MA **und** (in
`employeeExtraStrain`) Stunden/Wunsch/Präferenz. Höher belastete MA
bekommen also bevorzugt Wunsch/Ruhe/Schichtwechsel-Verbesserungen.
Statisch (deterministisch). `total_strain` nutzt die gewichtete Summe;
`employee_strain` (Summary) bleibt der rohe Index; `hours[]` führt je
MA `strain` + `weight`.

**Unterstunden hoch priorisiert:** `monthly_undertime_deviation` (4,0/h)
für Ist<Soll, `monthly_hours_deviation` (1,5/h) sonst. Bewusst unter
den Ruhepausen (Sequenz-Strain, zusätzlich m-skaliert) → Reihenfolge
Ruhe > Unterstunden > Überstunden/Präferenz.

Verifiziert: PHPUnit 26/26 (7185 Assertions, inkl. SA-Determinismus,
Soll-Stunden, Real-Daten-Feasibility mit locked+blocked+Gewichtung),
Frontend 10/10, Build grün.
