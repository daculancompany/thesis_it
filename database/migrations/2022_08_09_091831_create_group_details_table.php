<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('group_id')->unsigned(); 
            $table->bigInteger('student_id')->unsigned(); 
            $table->foreign('group_id')->references('id')->on('groups')->unsigned()->onDelete('cascade'); 
            $table->foreign('student_id')->references('id')->on('students')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });

        DB::table('group_details')->insert(
            array(
                'group_id' => 1,
                'student_id' => 1,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 1,
                'student_id' => 2,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 1,
                'student_id' => 3,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 1,
                'student_id' => 4,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 1,
                'student_id' => 5,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 2,
                'student_id' => 6,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 2,
                'student_id' => 7,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 2,
                'student_id' => 8,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 2,
                'student_id' => 9,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 2,
                'student_id' => 10,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 3,
                'student_id' => 11,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 3,
                'student_id' => 12,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 3,
                'student_id' => 13,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 3,
                'student_id' => 14,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 3,
                'student_id' => 15,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 4,
                'student_id' => 16,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 4,
                'student_id' => 17,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 4,
                'student_id' => 18,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 4,
                'student_id' => 19,
            )
        );
        DB::table('group_details')->insert(
            array(
                'group_id' => 4,
                'student_id' => 20,
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
        Schema::dropIfExists('group_details');
    }
}
