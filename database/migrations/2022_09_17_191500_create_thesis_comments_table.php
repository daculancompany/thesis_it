<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis_comments', function (Blueprint $table) {
            $table->id();
           // $table->bigInteger('faculty_id')->unsigned();
            $table->bigInteger('document_id')->unsigned();
            //$table->bigInteger('thesis_id')->unsigned();
           // $table->foreign('faculty_id')->references('id')->on('faculty')->unsigned()->onDelete('cascade'); 
            $table->foreign('document_id')->references('id')->on('thesis_documents')->unsigned()->onDelete('cascade'); 
          //  $table->foreign('thesis_id')->references('id')->on('thesis')->unsigned()->onDelete('cascade'); 
            $table->longText('comment');
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
        Schema::dropIfExists('thesis_comments');
    }
}
