<?php

namespace Database\Seeders;

use App\Models\Shift;
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
        $dummyF1Shift = new Shift([
            'abrv' => 'F1',
            'h_duration' => 8.00,
            'color_hex' => '#fe5741'
        ]);
        $dummyF1Shift->save();

        $dummyS1Shift = new Shift([
            'abrv' => 'S1',
            'h_duration' => 8.00,
            'color_hex' => '#598ec7'
        ]);
        $dummyS1Shift->save();

        $dummyFreeShift = new Shift([
            'abrv' => '-',
            'h_duration' => 0.00,
            'color_hex' => '#000000'
        ]);
        $dummyFreeShift->save();
    }
}
