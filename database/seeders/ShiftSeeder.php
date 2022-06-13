<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\ShiftType;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shift_type_seeder = new ShiftTypeSeeder;
        $shift_type_seeder->runForShiftSeeder();

        $dummyF1Shift = new Shift([
            'abrv' => 'F1',
            'shift_type_id' => 1,
            'h_duration' => 8.00,
            'color_hex' => '#fe5741'
        ]);
        $dummyF1Shift->save();

        $dummyF2Shift = new Shift([
            'abrv' => 'F2',
            'shift_type_id' => 1,
            'h_duration' => 6.00,
            'color_hex' => '#fe7000'
        ]);
        $dummyF2Shift->save();

        $dummyS1Shift = new Shift([
            'abrv' => 'S1',
            'shift_type_id' => 2,
            'h_duration' => 8.00,
            'color_hex' => '#598ec7'
        ]);
        $dummyS1Shift->save();

        $dummyS1Shift = new Shift([
            'abrv' => 'S2',
            'shift_type_id' => 2,
            'h_duration' => 6.00,
            'color_hex' => '#318ab7'
        ]);
        $dummyS1Shift->save();

        $dummyFreeShift = new Shift([
            'abrv' => 'N1',
            'shift_type_id' => 3,
            'h_duration' => 8.00,
            'color_hex' => '#932092'
        ]);
        $dummyFreeShift->save();

        $dummyFreeShift = new Shift([
            'abrv' => 'N2',
            'shift_type_id' => 3,
            'h_duration' => 6.00,
            'color_hex' => '#702092'
        ]);
        $dummyFreeShift->save();

        $dummyFreeShift = new Shift([
            'abrv' => 'U1',
            'shift_type_id' => 5,
            'h_duration' => 8.00,
            'color_hex' => '#1ddce2'
        ]);
        $dummyFreeShift->save();

        $dummyFreeShift = new Shift([
            'abrv' => 'K1',
            'shift_type_id' => 5,
            'h_duration' => 8.00,
            'color_hex' => '#a00000'
        ]);
        $dummyFreeShift->save();
    }
}
