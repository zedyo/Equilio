<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    /**
     * Eine Pflegekraft darf nur auf die eigenen Daten zugreifen.
     * Leitung (oder fehlende Auth, z. B. im Test) ist nicht eingeschränkt.
     */
    protected function authorizeEmployee($employeeId): void
    {
        $user = Auth::user();

        if (! $user || $user->isLeitung()) {
            return;
        }

        if ((int) $employeeId !== (int) $user->employee_id) {
            abort(403, 'Zugriff nur auf eigene Daten erlaubt.');
        }
    }
}
