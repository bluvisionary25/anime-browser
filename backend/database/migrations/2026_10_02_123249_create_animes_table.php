<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('animes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('genre_id')->constrained('genres')->cascadeOnDelete();
            $table->string('title');
            $table->text('synopsis')->nullable();
            $table->integer('episodes')->nullable();
            $table->decimal('score', 3, 1)->nullable();
            $table->string('poster_image')->nullable();
            $table->string('status')->default('ongoing');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animes');
    }
};
