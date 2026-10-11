<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Anime;
use App\Models\Genre;

class AnimeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $animes = [
            [
                'title' => 'Frieren: Beyond Journey\'s End',
                'genre' => 'Fantasy',
                'synopsis' => 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about.',
                'episodes' => 28,
                'score' => 9.3,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/43806/medium.jpg',
                'status' => 'completed',
            ],
            [
                'title' => 'Attack on Titan',
                'genre' => 'Action',
                'synopsis' => 'Humanity is forced to live in cities surrounded by enormous walls that protect them from gigantic man-eating humanoids.',
                'episodes' => 89,
                'score' => 9.0,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/7442/medium.jpg',
                'status' => 'completed',
            ],
            [
                'title' => 'Jujutsu Kaisen',
                'genre' => 'Shounen',
                'synopsis' => 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.',
                'episodes' => 47,
                'score' => 8.6,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/42717/medium.jpg',
                'status' => 'ongoing',
            ],
            [
                'title' => 'Demon Slayer',
                'genre' => 'Action',
                'synopsis' => 'A family is attacked by demons and only two members survive.',
                'episodes' => 55,
                'score' => 8.5,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/42765/medium.jpg',
                'status' => 'ongoing',
            ],
            [
                'title' => 'Naruto',
                'genre' => 'Shounen',
                'synopsis' => 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage.',
                'episodes' => 220,
                'score' => 7.9,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/11/medium.jpg',
                'status' => 'completed',
            ],
            [
                'title' => 'One Piece',
                'genre' => 'Adventure',
                'synopsis' => 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever left by the legendary Pirate, Gold Roger.',
                'episodes' => 1100,
                'score' => 9.0,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/12/medium.jpg',
                'status' => 'ongoing',
            ],
            [
                'title' => 'Gintama',
                'genre' => 'Comedy',
                'synopsis' => 'In an era where aliens have invaded and taken over feudal Tokyo, an unemployed samurai finds work however he can.',
                'episodes' => 367,
                'score' => 8.9,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/805/medium.jpg',
                'status' => 'completed',
            ],
            [
                'title' => 'Steins;Gate',
                'genre' => 'Sci-Fi',
                'synopsis' => 'A group of friends manage to create a machine capable of sending messages across time.',
                'episodes' => 24,
                'score' => 9.1,
                'poster_url' => 'https://media.kitsu.app/anime/poster_images/6045/medium.jpg',
                'status' => 'completed',
            ],
        ];

        foreach ($animes as $animeData) {
            $genre = Genre::where('name', $animeData['genre'])->first();
            
            if ($genre) {
                Anime::updateOrCreate(
                    ['title' => $animeData['title']],
                    [
                        'genre_id' => $genre->id,
                        'synopsis' => $animeData['synopsis'],
                        'episodes' => $animeData['episodes'],
                        'score' => $animeData['score'],
                        'poster_image' => $animeData['poster_url'],
                        'status' => $animeData['status'],
                    ]
                );
            }
        }
    }
}
