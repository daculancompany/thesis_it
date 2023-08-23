<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thesis extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'thesis';

    public function group()
    {
        return $this->belongsTo('App\Models\Groups');
    }

    
    public function groupDetails()
    {
       return $this->hasMany('App\Models\GroupDetails', 'group_id');
    //    return $this->hasMany('App\Models\GroupDetails', 'group_id', 'id')
    //     ->join('students', 'students.id', '=', 'group_details.student_id')
    //     ->first();
        //->orderBy('date', 'asc')->get();
    // return $this->belongsTo('App\Models\GroupDetails', 'group_id')
    // ->join('students', 'students.id', '=', 'group_details.student_id');
    // return $this->belongsTo('App\Models\GroupDetails');
    }

    function scheduleAssigned() {
        return $this->belongsTo('App\Models\DefenseThesisDetails', 'thesis_id');
    }

    public function stage()
    {
        return $this->belongsTo('App\Models\ThesisStages');
    }
    
    




}
