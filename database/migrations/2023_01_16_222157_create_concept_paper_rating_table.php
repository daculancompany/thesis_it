<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConceptPaperRatingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('concept_paper_rating', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('faculty_panel_id')->unsigned();
            $table->bigInteger('defense_sched_id')->unsigned();
            $table->bigInteger('thesis_id')->unsigned();
            $table->bigInteger('defense_thesis_details_id')->unsigned();
            $table->integer('research_topic')->length(2);
            $table->integer('relevant_literature')->length(2);
            $table->integer('issues_gap')->length(2);
            $table->integer('possibe_solutions')->length(2);
            $table->integer('overall_concept')->length(2);
            $table->longText('recommendation')->nullable();
            $table->decimal('total', 8, 2)->default(0.0);

            // $table->foreign('faculty_panel_id')->references('id')->on('users')->unsigned()->onDelete('cascade'); 
            // $table->foreign('defense_sched_id')->references('id')->on('defense_sched')->unsigned()->onDelete('cascade');
            // $table->foreign('thesis_id')->references('id')->on('thesis')->unsigned()->onDelete('cascade'); 
            // $table->foreign('defense_thesis_details_id')->references('id')->on('defense_thesis_details')->unsigned()->onDelete('cascade'); 
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
        Schema::dropIfExists('concept_paper_rating');
    }
}
