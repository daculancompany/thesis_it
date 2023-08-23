<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groups extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'groups';

    public function groupDetails()
    {
       // return $this->hasMany('App\Models\group_details', 'student_id');
       return $this->belongsTo('App\Models\GroupDetails');
    }

}
