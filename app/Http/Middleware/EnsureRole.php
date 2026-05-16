<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Lässt die Anfrage nur durch, wenn der eingeloggte Nutzer eine der
     * geforderten Rollen hat. Nutzung: ->middleware('role:leitung').
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'Für diese Aktion fehlt die Berechtigung.');
        }

        return $next($request);
    }
}
