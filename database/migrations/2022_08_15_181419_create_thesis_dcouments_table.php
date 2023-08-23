<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisDcoumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis_documents', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('thesis_id')->unsigned(); 
            $table->bigInteger('student_id')->unsigned(); 
            $table->string('document',255)->nullable();
            $table->string('notes',255)->nullable();
            $table->string('document_name',255)->nullable();
            $table->enum('is_schedule',['yes','no'])->default('no');
            $table->foreign('thesis_id')->references('id')->on('thesis')->unsigned()->onDelete('cascade'); 
            $table->foreign('student_id')->references('id')->on('students')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('thesis_documents');
    }
}
