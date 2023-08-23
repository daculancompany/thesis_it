<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('thesis_id')->unsigned(); 
            $table->string('log',255);

            $table->foreign('thesis_id')->references('id')->on('thesis')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('thesis_logs');
    }
}
