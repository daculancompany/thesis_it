<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DefensePanel extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'defense_panel';

    public function panel_faculty()
    {
        return $this->hasMany('App\Models\DefensePanelFaculty', 'defense_panel_id','id');
        
    }

}
