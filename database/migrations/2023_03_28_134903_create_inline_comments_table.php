<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInlineCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inline_comments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('doc_id')->unsigned(); 
            $table->longText('comments');
            $table->foreign('doc_id')->references('id')->on('thesis_documents')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('inline_comments');
    }
}
