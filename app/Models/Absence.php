<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Absence extends Model
{
    use HasFactory, SoftDeletes;

    public const TYPES = ['vacation', 'sick', 'training', 'other'];

    protected $fillable = [
        'employee_id',
        'type',
        'start_date',
        'end_date',
        'note',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    /**
     * Überschneidet die Abwesenheit einen konkreten Tag?
     * (Grundlage für den späteren Generator: an solchen Tagen darf der
     * Mitarbeiter nicht verplant werden.)
     */
    public function coversDate(string $date): bool
    {
        return $date >= $this->start_date->format('Y-m-d')
            && $date <= $this->end_date->format('Y-m-d');
    }
}
