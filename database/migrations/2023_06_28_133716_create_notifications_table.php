<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned(); 
            $table->bigInteger('user_id_from')->unsigned(); 
            $table->string('notification',255);
            $table->enum('status',['unseen','seen'])->default('unseen');
            $table->date('date_sched')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->unsigned(); 
            // $table->foreign('user_id_from')->references('id')->on('users')->unsigned(); 
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
        Schema::dropIfExists('notifications');
    }
}
