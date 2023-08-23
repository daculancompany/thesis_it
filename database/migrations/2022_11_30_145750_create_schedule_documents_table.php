<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_documents', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('schedule_id')->unsigned(); 
            $table->bigInteger('thesis_doc_id')->unsigned(); 
            $table->foreign('schedule_id')->references('id')->on('defense_sched')->unsigned()->onDelete('cascade'); 
            $table->foreign('thesis_doc_id')->references('id')->on('thesis_documents')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_documents');
    }
}
