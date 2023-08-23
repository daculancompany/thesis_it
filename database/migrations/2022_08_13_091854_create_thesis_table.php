<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sy_id')->unsigned(); 
            //$table->bigInteger('sem_id')->unsigned();
           // $table->bigInteger('adviser')->unsigned();
            $table->bigInteger('stage_id')->default(1)->unsigned();
            $table->bigInteger('group_id')->unsigned(); 
            $table->bigInteger('faculty_id')->unsigned(); 
            $table->string('thesis_name',100)->nullable();
            $table->string('thesis_description',100)->nullable();
            //$table->string('document',255)->nullable();
            //$table->string('document_name',255)->nullable();
            $table->enum('status',['active','inactive','completed'])->default('active');
            $table->foreign('sy_id')->references('id')->on('school_year')->unsigned()->onDelete('cascade'); 
            $table->foreign('group_id')->references('id')->on('groups')->unsigned()->onDelete('cascade'); 
            //$table->foreign('sem_id')->references('id')->on('semesters')->unsigned()->onDelete('cascade'); 
            //$table->foreign('adviser')->references('id')->on('faculty')->unsigned()->onDelete('cascade'); 
             $table->foreign('stage_id')->references('id')->on('thesis_stages')->unsigned()->onDelete('cascade'); 
             $table->foreign('faculty_id')->references('user_id')->on('faculty')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });

        DB::table('thesis')->insert(
            array(
                'sy_id' => 1,
                'stage_id' => 1,
                'group_id' => 1,
                'faculty_id' => 1,
                'status' => "active",
            )
        );
        DB::table('thesis')->insert(
            array(
                'sy_id' => 1,
                'stage_id' => 1,
                'group_id' => 2,
                'faculty_id' => 2,
                'status' => "active",
            )
        );
        DB::table('thesis')->insert(
            array(
                'sy_id' => 1,
                'stage_id' => 1,
                'group_id' => 3,
                'faculty_id' => 3,
                'status' => "active",
            )
        );
        DB::table('thesis')->insert(
            array(
                'sy_id' => 1,
                'stage_id' => 1,
                'group_id' => 4,
                'faculty_id' => 4,
                'status' => "active",
            )
        );
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('thesis');
    }
}
