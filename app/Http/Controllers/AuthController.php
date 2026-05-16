<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Session-Login (Sanctum SPA, Cookie-basiert). Erwartet, dass der
     * Client zuvor /sanctum/csrf-cookie geholt hat.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'E-Mail oder Passwort ist falsch.',
            ]);
        }

        $request->session()->regenerate();

        return response()->json($this->profile($request));
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Abgemeldet.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->profile($request));
    }

    private function profile(Request $request): array
    {
        $user = $request->user()->loadMissing('employee');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'employee_id' => $user->employee_id,
            'employee' => $user->employee,
        ];
    }
}
