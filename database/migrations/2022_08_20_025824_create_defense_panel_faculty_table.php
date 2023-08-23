<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDefensePanelFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('defense_panel_faculty', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('faculty_id')->unsigned(); 
            $table->bigInteger('defense_panel_id')->unsigned(); 
            // $table->foreign('defense_panel_id')->references('id')->on('defense_panel')->unsigned()->onDelete('cascade'); 
            // $table->foreign('faculty_id')->references('id')->on('faculty')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('defense_panel_faculty');
    }
}
