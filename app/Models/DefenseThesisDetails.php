<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefenseThesisDetails extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'defense_thesis_details';


    public function schedule()
    {
        return $this->belongsTo('App\Models\DefenseShedule');
    }

    public function student_details()
    {
        return $this->hasMany('App\Models\Students', 'id','student_id');
        
    }
}
