<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Qualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'description'
    ];

    protected $guarded = [
        'id'
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

// PLAYGROUND
//    public function testMethode($param) {
//        return 'das ist ein test '.$param;
//    }
}
