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
    ],

    // Standard-Soll-Wochenstunden bei 100 % Beschäftigung.
    'full_time_weekly_hours' => 39,
];
