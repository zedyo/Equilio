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

**Aufgedeckte Schwäche (wichtig):** Der **Mitarbeiter-Strain steigt mit
mehr Diensten stark** (B: 1472), weil das Greedy-Verfahren freie Tage
fragmentiert → viele „isolierte freie Tage" (+8) statt „2 freie Tage am
Stück" (−5). Hard-Regeln & Besetzung stimmen, aber das **Erholungsmuster
wird nicht optimiert**. Konkretes nächstes Iterationsziel: zweite
Optimierungsphase (lokale Suche/Tausch), die bei gleichbleibender
Besetzung den Soft-Strain senkt (freie Tage bündeln). Reproduzierbar via
`/tmp`-Analyseskripte bzw. einem späteren `php artisan roster:evaluate`.
