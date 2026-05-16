<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'preferenceData' => ['required', 'array'],
            'preferenceData.employee_id' => ['required', 'integer', 'exists:employees,id'],
            'preferenceData.shift_id' => ['required', 'integer', 'exists:shifts,id'],
            'preferenceData.level' => ['nullable', 'in:preferred,valid,blocked'],
        ];
    }
}
