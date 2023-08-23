<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupDetails extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'group_details';

    public function students() {
        return $this->hasMany('App\model\Students');
    }

    
}
