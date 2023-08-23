<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned(); 
            $table->string('fname',100);
            $table->string('lname',100);
            $table->string('mname',100)->nullable();
            $table->string('phone',30)->nullable();
            $table->string('email',100)->unique();
            $table->string('address',200)->nullable();
            $table->string('about')->nullable();
            $table->date('dob')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });

        DB::table('faculty')->insert(
            array(
                'user_id' => 1,
                'fname' => "Emily",
                'lname' => 'Allard',
                'mname' => 'J',
                'phone' => '09150480941',
                'email' => 'faculty1@gmail.com',
            )
        );
        DB::table('faculty')->insert(
            array(
                'user_id' => 2,
                'fname' => "Ann",
                'lname' => 'Crabtree',
                'mname' => 'A',
                'phone' => '09150480942',
                'email' => 'faculty2@gmail.com',
            )
        );
        DB::table('faculty')->insert(
            array(
                'user_id' => 3,
                'fname' => "Michelle",
                'lname' => 'Scott',
                'mname' => 'H',
                'phone' => '09150480943',
                'email' => 'faculty3@gmail.com',
            )
        );
        DB::table('faculty')->insert(
            array(
                'user_id' => 4,
                'fname' => "Edward",
                'lname' => 'Meserve',
                'mname' => 'J',
                'phone' => '09150480944',
                'email' => 'faculty4@gmail.com',
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
        Schema::dropIfExists('faculty');
    }
}
