<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned()->nullable(); 
            $table->bigInteger('college_id')->unsigned(); 
            $table->bigInteger('department_id')->unsigned(); 
            $table->string('fname',100);
            $table->string('lname',100);
            $table->string('mname',1)->nullable();
            $table->string('phone',30)->nullable();
            $table->string('email',100)->unique();
            $table->string('address',200)->nullable();
            $table->date('dob')->nullable();
            $table->string('about')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->unsigned()->onDelete('cascade'); 
            $table->foreign('college_id')->references('id')->on('college')->unsigned()->onDelete('cascade'); 
            $table->foreign('department_id')->references('id')->on('department')->unsigned()->onDelete('cascade'); 
            $table->timestamps();
        });

        DB::table('students')->insert(
            array(
                'user_id' => 5,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Allen",
                'lname' => 'Ngo',
                'mname' => 'A',
                'phone' => '09150480945',
                'email' => 'student1@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 6,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Ronald",
                'lname' => 'Leonard',
                'mname' => 'L',
                'phone' => '09150480946',
                'email' => 'student2@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 7,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Billie",
                'lname' => 'Straw',
                'mname' => 'D',
                'phone' => '09150480947',
                'email' => 'student3@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 8,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Gary",
                'lname' => 'Lester',
                'mname' => 'I',
                'phone' => '09150480948',
                'email' => 'student4@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 9,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Beverly",
                'lname' => 'Vazquez',
                'mname' => 'S',
                'phone' => '09150480949',
                'email' => 'student5@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 10,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Gregg",
                'lname' => 'Price',
                'mname' => 'J',
                'phone' => '09150480950',
                'email' => 'student6@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 11,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Bruce",
                'lname' => 'Baltzell',
                'mname' => 'C',
                'phone' => '09150480951',
                'email' => 'student7@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 12,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Winston",
                'lname' => 'Arnold',
                'mname' => 'L',
                'phone' => '09150480952',
                'email' => 'student8@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 13,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Doris",
                'lname' => 'Hedrick',
                'mname' => 'J',
                'phone' => '09150480953',
                'email' => 'student9@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 14,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Patrick",
                'lname' => 'Roberson',
                'mname' => 'L',
                'phone' => '09150480954',
                'email' => 'student10@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 15,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Andre",
                'lname' => 'Holman',
                'mname' => 'C',
                'phone' => '09150480955',
                'email' => 'student11@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 16,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Max",
                'lname' => 'Taylor',
                'mname' => 'K',
                'phone' => '09150480956',
                'email' => 'student12@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 17,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Patricia",
                'lname' => 'Martinez',
                'mname' => 'E',
                'phone' => '09150480957',
                'email' => 'student13@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 18,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Charles",
                'lname' => 'Garcia',
                'mname' => 'T',
                'phone' => '09150480958',
                'email' => 'student14@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 19,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Timmy",
                'lname' => 'Jones',
                'mname' => 'B',
                'phone' => '09150480959',
                'email' => 'student15@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 20,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Sonny",
                'lname' => 'Olson',
                'mname' => 'E',
                'phone' => '09150480960',
                'email' => 'student16@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 21,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Carol",
                'lname' => 'Ringo',
                'mname' => 'W',
                'phone' => '09150480961',
                'email' => 'student17@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 22,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Rhonda",
                'lname' => 'Stroud',
                'mname' => 'K',
                'phone' => '09150480962',
                'email' => 'student18@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 23,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Patricia",
                'lname' => 'Garrett',
                'mname' => 'A',
                'phone' => '09150480963',
                'email' => 'student19@gmail.com',
            )
        );
        DB::table('students')->insert(
            array(
                'user_id' => 24,
                'college_id' => 1,
                'department_id' => 1,
                'fname' => "Erik",
                'lname' => 'Kirby',
                'mname' => 'K',
                'phone' => '09150480964',
                'email' => 'student20@gmail.com',
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
        Schema::dropIfExists('students');
    }
}
