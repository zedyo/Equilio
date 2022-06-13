<?php

namespace Database\Seeders;

use App\Models\ShiftType;
use Illuminate\Database\Seeder;

class ShiftTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    }

    public function runForShiftSeeder()
    {
        $dummyShiftType1 = new ShiftType([
            'name' => 'Frühschicht',
            'active_duty' => true
        ]);
        $dummyShiftType1->save();

        $dummyShiftType2 = new ShiftType([
            'name' => 'Spätschicht',
            'active_duty' => true

        ]);
        $dummyShiftType2->save();

        $dummyShiftType3 = new ShiftType([
            'name' => 'Nachtschicht',
            'active_duty' => true

        ]);
        $dummyShiftType3->save();

        $dummyShiftType4 = new ShiftType([
            'name' => 'Zwischenschicht',
            'active_duty' => true

        ]);
        $dummyShiftType4->save();

        $dummyShiftType5 = new ShiftType([
            'name' => 'Frei (bezahlt)',
            'active_duty' => false
        ]);
        $dummyShiftType5->save();

        $dummyShiftType6 = new ShiftType([
            'name' => 'Fort- & Ausbildung',
            'active_duty' => false
        ]);
        $dummyShiftType6->save();
    }
}
