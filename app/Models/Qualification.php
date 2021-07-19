<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Qualification extends Model
{
    use HasFactory, SoftDeletes;

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
