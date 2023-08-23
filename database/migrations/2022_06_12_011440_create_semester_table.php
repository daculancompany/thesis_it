<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Semester;

class CreateSemesterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('semester',20);
            $table->timestamps();
        });
        DB::table('semesters')->insert(
            array(
                'id' => 1,
                'semester' => 'First Semester',
            )
        );
        DB::table('semesters')->insert(
            array(
                'id' => 2,
                'semester' => 'Second Semester',
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
        Schema::dropIfExists('semesters');
    }
}
