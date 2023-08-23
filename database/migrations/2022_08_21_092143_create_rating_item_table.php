<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatingItemTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rating_item', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('rating_cat_id')->unsigned();  
            $table->bigInteger('defense_panel_faculty_id')->unsigned();  
            $table->longText('rating_item_description');
            $table->float('score');
            $table->foreign('rating_cat_id')->references('id')->on('rating_cat')->unsigned()->onDelete('cascade');
            $table->foreign('defense_panel_faculty_id')->references('id')->on('defense_panel_faculty')->unsigned()->onDelete('cascade');
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
        Schema::dropIfExists('rating_item');
    }
}
