<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefensePanelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('defense_panel', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('defense_sched_details_id')->unsigned(); 
            $table->foreign('defense_sched_details_id')->references('id')->on('defense_thesis_details')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('defense_panel');
    }
}
