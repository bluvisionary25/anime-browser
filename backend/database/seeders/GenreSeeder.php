<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Genre;
use Illuminate\Support\Str;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = ['Action', 'Shounen', 'Adventure', 'Comedy', 'Fantasy', 'Sci-Fi'];
        
        foreach ($genres as $genre) {
            Genre::firstOrCreate(
                ['slug' => Str::slug($genre)],
                ['name' => $genre]
            );
        }
    }
}
