<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeparmentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('department', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('college_id')->unsigned(); 
            $table->string('dept_name',255);
            $table->foreign('college_id')->references('id')->on('college')->unsigned(); 
            $table->timestamps();
        });

        DB::table('department')->insert(
            array(
                'college_id' => 1,
                'dept_name' => 'INFORMATION TECHNOLOGY',
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
        Schema::dropIfExists('department');
    }
}
