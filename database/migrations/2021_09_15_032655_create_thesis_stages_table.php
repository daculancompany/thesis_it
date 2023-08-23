<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThesisStagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('thesis_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name',30);
            $table->timestamps();
        });
        DB::table('thesis_stages')->insert(
            array(
                'id' => 1,
                'name' => 'Concept',
            )
        );
        DB::table('thesis_stages')->insert(
            array(
                'id' => 2,
                'name' => 'Proposal',
            )
        );
        DB::table('thesis_stages')->insert(
            array(
                'id' => 3,
                'name' => 'Final',
            )
        );
        DB::table('thesis_stages')->insert(
            array(
                'id' => 4,
                'name' => 'Re-Defense',
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
        Schema::dropIfExists('thesis_stages');
    }
}
