<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InlineComments extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'inline_comments';
}
