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
