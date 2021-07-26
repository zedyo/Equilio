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
        'h_duration',
        'color_hex'
    ];

    public function duties(): HasMany
    {
        return $this->hasMany(Duty::class);
    }
}
