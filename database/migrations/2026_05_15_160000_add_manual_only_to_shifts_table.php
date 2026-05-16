<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            // true = darf nur manuell vergeben werden; der automatische
            // Generator weist solche Schichten nie zu und überschreibt
            // bestehende Einträge nicht (z. B. FO = Fortbildung).
            $table->boolean('manual_only')->default(false)->after('color_hex');
        });
    }

    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn('manual_only');
        });
    }
};
