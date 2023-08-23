<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefenseShedule extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'defense_sched';

    public function sched_details()
    {
        return $this->hasMany('App\Models\DefenseThesisDetails', 'defense_sched_id','id');
        
    }

    public function category()
    {
        return $this->belongsTo('App\Models\ThesisStages', 'stage_id','id');
        
    }
}
