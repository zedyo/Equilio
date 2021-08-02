<?php

namespace Database\Seeders;

use App\Models\Qualification;
use Illuminate\Database\Seeder;

class QualificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dummyQualification1 = new Qualification([
            'description' => 'Exam. Pfleger:in'
        ]);
        $dummyQualification1->save();

        $dummyQualification2 = new Qualification([
            'description' => 'Qual. Pflegehelfer:in'
        ]);
        $dummyQualification2->save();

        $dummyQualification3 = new Qualification([
            'description' => 'Pflegehelfer:in'
        ]);
        $dummyQualification3->save();

        $dummyQualification4 = new Qualification([
            'description' => 'Betreuungsassistent:in'
        ]);
        $dummyQualification4->save();

//        Qualification::factory(3)->create();
    }
}
