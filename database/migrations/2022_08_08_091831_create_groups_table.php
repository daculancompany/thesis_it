<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_name',100);
            $table->bigInteger('faculty_id')->unsigned(); 
            $table->bigInteger('team_lead')->unsigned(); 
            $table->string('year_added',100);
           // $table->bigInteger('user_id')->unsigned()->nullable(); 
            $table->foreign('faculty_id')->references('user_id')->on('faculty')->unsigned()->onDelete('cascade'); 
            $table->foreign('team_lead')->references('id')->on('students')->unsigned()->onDelete('cascade'); 
            // $table->foreign('user_id')->references('id')->on('users')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });

        DB::table('groups')->insert(
            array(
                'group_name' => "Group 1",
                'faculty_id' => 1,
                'team_lead' => 1,
                'year_added' => date('Y'),
            )
        );
        DB::table('groups')->insert(
            array(
                'group_name' => "Group 2",
                'faculty_id' => 2,
                'team_lead' => 6,
                'year_added' => date('Y'),
            )
        );
        DB::table('groups')->insert(
            array(
                'group_name' => "Group 3",
                'faculty_id' => 3,
                'team_lead' => 11,
                'year_added' => date('Y'),
            )
        );
        DB::table('groups')->insert(
            array(
                'group_name' => "Group 4",
                'faculty_id' => 4,
                'team_lead' => 16,
                'year_added' => date('Y'),
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
        Schema::dropIfExists('groups');
    }
}
