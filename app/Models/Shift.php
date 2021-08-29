<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shift extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'abrv',
        'shift_type_id',
        'h_duration',
        'color_hex'
    ];

    public function shift_type(){
        return $this->belongsTo(ShiftType::class, 'shift_type_id');
    }

    public function duties(): HasMany
    {
        return $this->hasMany(Duty::class);
    }
}
