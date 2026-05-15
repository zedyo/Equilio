<?php

/*
|--------------------------------------------------------------------------
| Dienstplan-Regelwerk (Grundlage für Belastungsindex & Generator)
|--------------------------------------------------------------------------
|
| Diese Parameter werden vom künftigen StrainIndex/RosterGenerator gelesen.
| Sie sind hier zentral konfigurierbar, damit unterschiedliche Branchen /
| Tarifwerke abgebildet werden können (Proposal-Ziel: frei konfigurierbar).
|
*/

return [

    // Maximale Anzahl Dienste in Folge ohne freien Tag.
    'max_consecutive_duties' => 6,

    // Mindest-Ruhezeit zwischen zwei Diensten in Stunden.
    'min_rest_hours' => 11,

    // Verbotene Schichtart-Übergänge von einem Tag auf den nächsten
    // (Quelle: Proposal – z. B. Nachtschicht -> direkt Frühschicht).
    // Werte sind ShiftType-Namen.
    'forbidden_transitions' => [
        ['from' => 'Nachtschicht', 'to' => 'Frühschicht'],
    ],

    // Bewertung von Konstellationen für den Belastungsindex.
    // Höherer Wert = höhere Belastung. INF = unzulässig.
    'strain_weights' => [
        'consecutive_over_max' => INF,
        'forbidden_transition' => INF,
        'understaffed_shift' => 50,
        'isolated_free_day' => 8,   // 2 Dienste, frei, 2 Dienste -> weniger gut
        'third_consecutive_duty' => -2, // 2 Dienste, dann 3. -> ok/gut
        'two_free_days_in_row' => -5,   // gut für Erholung
        // Aktive Schicht ohne examinierte Fachkraft besetzt (pro Schicht/Tag).
        'missing_required_qualification' => 30,
    ],

    // Mind. eine Kraft mit dieser Qualifikation muss je aktiver Schicht
    // und Tag eingeplant sein (Pflege-Realismus). null = Regel aus.
    'required_qualification' => 'Exam. Pfleger:in',

    // Standard-Soll-Wochenstunden bei 100 % Beschäftigung.
    'full_time_weekly_hours' => 39,

    // Zusätzliche Bewertungsterme im Generator (fließen in die
    // Akzeptanz der lokalen Suche / des SA und in den Gesamt-Index ein):
    //  - monthly_hours_deviation: Strafe je Stunde Abweichung vom
    //    Monats-Soll je Mitarbeiter (Auslastung -> Soll-Stunden treffen).
    //  - wish_violation: Strafe je nicht erfülltem Tages-Wunsch
    //    (hoch gewichtet -> Work/Life-Balance).
    //  - preference_miss: kleine Strafe je Dienst, der nicht einer
    //    hinterlegten Schicht-Präferenz entspricht (sanfte Lenkung).
    'monthly_hours_deviation' => 1.5,
    'wish_violation' => 25.0,
    'preference_miss' => 0.5,

    // Ab dieser MA-Zahl wird die erschöpfende O(E^2*days^2)-Lokalsuche
    // übersprungen; allein das (gedeckelte) Simulated Annealing optimiert
    // dann. Hält große Bestände interaktiv (vgl. real-roster-insights.md).
    'local_search_max_employees' => 24,

    // Phase 2g: Simulated Annealing nach der Hill-Climbing-Lokalsuche.
    // Inkrementelle Δ-Bewertung -> performant. Fester Seed = reproduzierbar.
    'annealing' => [
        'enabled' => true,
        'iterations' => 3000,
        'start_temp' => 10.0,
        'cooling' => 0.999,
        'seed' => 1337,
    ],
];
