<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefenseSchedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('defense_sched', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('stage_id')->unsigned(); 
            $table->bigInteger('sy_id')->unsigned(); 
            $table->bigInteger('sem_id')->unsigned();
            $table->date('start_date');
            $table->date('end_date');
            // $table->string('date_array',255);
            $table->foreign('stage_id')->references('id')->on('thesis_stages')->unsigned()->onDelete('cascade'); 
            $table->foreign('sem_id')->references('id')->on('semesters')->unsigned()->onDelete('cascade'); 
            $table->foreign('sy_id')->references('id')->on('school_year')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('defense_sched');
    }
}
