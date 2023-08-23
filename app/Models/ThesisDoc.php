<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThesisDoc extends Model
{
    //https://stackoverflow.com/questions/26327965/how-to-set-eloquent-relationship-belongsto-through-another-model-in-laravel
    use HasFactory;
    protected $guarded = [];
    protected $table = 'thesis_documents';

    public function student()
    {
        return $this->belongsTo('App\Models\Students');
    }

    public function comment()
    {
        return $this->belongsTo('App\Models\ThesisComments', 'document_id');
    }
}
