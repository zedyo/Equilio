<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWishRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'wishData' => ['required', 'array'],
            'wishData.employee_id' => ['required', 'integer', 'exists:employees,id'],
            'wishData.shift_id' => ['required', 'integer', 'exists:shifts,id'],
            'wishData.day' => ['required', 'integer', 'min:1', 'max:31'],
            'wishData.month' => ['required', 'integer', 'min:1', 'max:12'],
            'wishData.year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ];
    }
}
