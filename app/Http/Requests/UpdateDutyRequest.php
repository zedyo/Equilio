<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDutyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dutyData' => ['required', 'array'],
            'dutyData.employee_id' => ['required', 'integer', 'exists:employees,id'],
            'dutyData.value' => ['present', 'nullable', 'string'],
            'dutyData.day' => ['required', 'integer', 'min:1', 'max:31'],
            'dutyData.month' => ['required', 'integer', 'min:1', 'max:12'],
            'dutyData.year' => ['required', 'integer', 'min:2000', 'max:2100'],
        ];
    }
}
