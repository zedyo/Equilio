<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('preferences', function (Blueprint $table) {
            // 'preferred' = bevorzugt, 'blocked' = darf nie vergeben werden.
            // Kein Datensatz = 'valid' (erlaubt, neutral).
            $table->string('level')->default('preferred')->after('shift_id');
        });
    }

    public function down(): void
    {
        Schema::table('preferences', function (Blueprint $table) {
            $table->dropColumn('level');
        });
    }
};
