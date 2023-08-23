<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefenseThesisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('defense_thesis_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('thesis_id')->unsigned();
            $table->bigInteger('defense_sched_id')->unsigned();  
            $table->date('date_sched');
            $table->string('time',30);
            // $table->foreign('thesis_id')->references('id')->on('thesis')->unsigned()->onDelete('cascade'); 
            $table->foreign('defense_sched_id')->references('id')->on('defense_sched')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('defense_thesis');
    }
}
