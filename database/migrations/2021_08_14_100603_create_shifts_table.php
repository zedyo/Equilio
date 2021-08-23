<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('abrv');
            $table->unsignedBigInteger('shift_type_id')->comment('Shift Type Id of Shift')->nullable()->unsigned();
            $table->decimal('h_duration', 10);
            $table->string('color_hex');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('shift_type_id')->references('id')->on('shift_types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shifts');
    }
}
