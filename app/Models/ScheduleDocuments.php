<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleDocuments extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'schedule_documents';

    public function document() {
        return $this->belongsTo('App\Models\ThesisDoc','thesis_doc_id');
    }

}
