# Projekthintergrund — „Yeti" (heute: Equilio)

> Historisches Dokument: Der Projektname im Bachelor-Proposal war **„Yeti"**
> (Repo-Name „yourPlan"). Produktname seit Mai 2026: **Equilio**. Die
> „Yeti"-Bezüge unten bleiben bewusst erhalten, da sie den Proposal-Stand
> dokumentieren (inkl. „Warum Yeti?").

Quelle: Major Project Proposal CMN6100, Abgabedatum 19.09.2021, Nikolai Seel (SAE Institut München, BA Web Development).

## Motivation

Der Autor war vor dem Studium ca. 10 Jahre in der Altenpflege tätig, zuletzt in einer Leitungsposition. Aus eigener Erfahrung weiß er, dass die monatliche Dienstplanerstellung in der Pflege:

- sehr komplex ist (24/7-Schichtbetrieb, Qualifikationsanforderungen, gesetzliche Ruhezeiten),
- meistens auf einer ausgedruckten Tabelle händisch („sudokuartig" mit Bleistift und Radiergummi) in der Freizeit erstellt wird,
- viele Stunden im Monat kostet, die für Pflege oder Erholung fehlen,
- ein zentrales Werkzeug zur Burnout-Prävention sein könnte, wenn die Last gerecht verteilt würde.

Existierende Software adressiert selten 24/7-Branchen mit komplexen Qualifikationsanforderungen. → industrierelevant.

## Idee

Web-Applikation („Yeti"), die:

1. Frei konfigurierbar ist, damit verschiedene Branchen ihre eigenen Rahmenbedingungen abbilden können.
2. Mittels Algorithmus den Dienstplan möglichst **automatisch generiert** — als Vorschlag, den die Leitungskraft nachjustieren kann.
3. Den Aufwand der Dienstplanerstellung deutlich senkt.

### Belastungsindex (Kernidee des Algorithmus)

Jede Schichtkonstellation eines Mitarbeiters bekommt einen numerischen Wert, der die Belastung/Erholung quantifiziert:

| Konstellation                                | Bewertung     |
|---------------------------------------------|---------------|
| 7 Dienste hintereinander                    | darf nicht sein |
| Nachtschicht → direkt Frühschicht           | darf nicht sein |
| 2 Dienste, dann 3. Dienst                   | gut           |
| 2 Dienste, frei, 2 Dienste                  | weniger gut   |
| 2 freie Tage hintereinander                 | gut           |
| 3 Frühdienstler, alle nur Helfer            | darf nicht sein (Qualifikation!) |
| 3 Frühdienstler, davon 1 examiniert         | knappe Belegung |
| 4 Frühdienstler, davon 1 examiniert         | gut           |

Algorithmus wählt bei der Generierung die Konstellation mit minimalem Belastungsindex; Mitarbeiter mit bereits hohem Index werden geschont (bevorzugt freie Tage / leichte Schichten).

## Zieldefinition (MoSCoW)

### MUSS

- Singlepage-App zum Anlegen von Mitarbeitern, Schichten, Qualifikationen, Schichtzuweisungen.
- Automatisch generierte Monatsübersicht (Layout wie Pflegedienstpläne).
- **Automatische Dienstplangenerierung** unter optimalen Bedingungen (kein Urlaub, keine Krankheit, kleine Gruppe).

### SOLL

- Generator auch im **erschwerten Szenario** (Urlaub, Krankheit, Ausfall).
- Manuelle Nachjustierung im Monat ≤ 30 % bei erschwertem Szenario.

### KANN

- Nachjustierung ≤ 10 %.
- Bedienerfreundliche UI/UX.
- Separate UIs für Pflegekraft vs. Leitungskraft.
- **Wunschsystem** — Mitarbeiter können Wünsche eintragen, der Algorithmus berücksichtigt sie nach Möglichkeit.

### Bewusst ausgeklammert (Prototyp ≠ Produkt)

- Hohe Performance.
- Browserunabhängigkeit.
- Lückenlose Authentifizierung & Security.

## Meilensteine (Original-Plan)

1. **bis KW 38/2021** – Rein manuelle Dienstplanerstellung möglich (Mitarbeiter/Schichten/Qualifikationen, Monatsansicht, Besetzung pro Tag, verplante Arbeitszeit pro MA).
2. **bis KW 40/2021** – Einfaches Testszenario inkl. Belege.
3. **bis KW 44/2021** – Algorithmus-Skizzen auf dem Papier (siehe Tabelle oben).
4. **bis KW 50/2021** – Algorithmus in PHP/Laravel + Frontend-Aufbereitung.
5. **bis KW 02/2022** – Algorithmus für erschwertes Szenario, ≥ 70 % Erfolgsquote.
6. **bis KW 06/2022** – Dokumentation, Evaluation, Präsentation.

## Testszenario

- Branche Pflege (eigene Berufserfahrung des Autors).
- Realistische, aber arbeitsrechtlich konforme Parameter.
- Mitarbeiterparameter: Qualifikation, Arbeitszeitmodell (vertraglich + gesetzlich).
- Mindestanforderungen pro Schicht (min. Anzahl pro Qualifikation).
- Realistische Arbeits-/Ruhephasen.
- Optimum: 1 Monat, niemand krank/im Urlaub. Dann schrittweise verschärfen.

## Ressourcen / Setup laut Proposal

- Computer mit Internet + IDE (VS Code) + TablePlus für DB-Verwaltung.
- Frameworks: Laravel und React (Grundlage in CMN6204 vorbereitet).

## Risiken

- Problem evtl. nicht qualitativ/quantitativ lösbar in der Zeit → Urlaub als Zeitpuffer, oder Abgabefrist-Verlängerung beantragen.
- Wenn nicht realisierbar: Austausch mit Academic Coordinator, ggf. Projekt erklärend abschließen.

## Warum „Yeti"?

Weil unklar war, ob die Lösung des Automatisierungsproblems überhaupt existiert. (Selbst­ironie des Autors.)
