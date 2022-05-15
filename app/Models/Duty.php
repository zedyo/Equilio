<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Duty extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'employee_id',
        'shift_id',
        'day',
        'month',
        'year',
        'wish_injury',
        'preference_injury',
        'creation_date'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
}
