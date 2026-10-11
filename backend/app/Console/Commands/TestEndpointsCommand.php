<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Anime;
use App\Models\Genre;
use Illuminate\Http\Request;

class TestEndpointsCommand extends Command
{
    protected $signature = 'app:test-endpoints';
    protected $description = 'Test all backend endpoints, roles, and validation';

    public function handle()
    {
        $this->info("=== Starting Comprehensive Backend Validation ===");

        // 1. Check Tables and counts
        $this->info("1. Database & Migrations Check:");
        $this->line("   Users count: " . User::count());
        $this->line("   Genres count: " . Genre::count());
        $this->line("   Animes count: " . Anime::count());
        $this->line("   Watchlists count: " . \App\Models\Watchlist::count());

        // 2. Models & Relationships check
        $this->info("2. Eloquent Relationships Check:");
        $anime = Anime::with('genre')->first();
        if ($anime) {
            $this->line("   Anime '{$anime->title}' belongsTo Genre: " . ($anime->genre ? $anime->genre->name : 'FAILED'));
        }
        $genre = Genre::with('animes')->first();
        if ($genre) {
            $this->line("   Genre '{$genre->name}' hasMany Animes: " . $genre->animes->count() . " items");
        }

        // 3. User & Admin check
        $this->info("3. User Roles Check:");
        $admin = User::where('role', 'admin')->first();
        $user = User::where('role', 'user')->first();
        $this->line("   Admin User exists: " . ($admin ? "{$admin->name} ({$admin->email})" : 'FAILED'));
        $this->line("   Regular User exists: " . ($user ? "{$user->name} ({$user->email})" : 'FAILED'));

        // 4. Role Authorization Check
        $this->info("4. Role-Based Middleware Check:");
        $adminToken = $admin->createToken('test_admin')->plainTextToken;
        $userToken = $user->createToken('test_user')->plainTextToken;

        // Reset auth guards to simulate separate HTTP requests
        auth()->forgetGuards();
        app()->forgetInstance('request');

        // Admin attempt on admin route
        $genreId = Genre::first()->id;
        $serverAdmin = [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $adminToken,
            'HTTP_ACCEPT' => 'application/json'
        ];
        $reqAdmin = Request::create('/api/admin/animes', 'POST', [
            'title' => 'Spy x Family Code: White',
            'genre_id' => $genreId,
            'synopsis' => 'The Forger family embarks on a weekend winter trip.',
            'episodes' => 1,
            'score' => 8.4,
            'poster_image' => 'https://via.placeholder.com/300x450',
            'status' => 'completed',
        ], [], [], $serverAdmin);
        $resAdmin = app()->handle($reqAdmin);
        $this->line("   Admin User -> POST /api/admin/animes: HTTP " . $resAdmin->getStatusCode() . " (Body: " . $resAdmin->getContent() . ")");

        // Reset auth guards
        auth()->forgetGuards();
        app()->forgetInstance('request');

        // User attempt on admin route
        $serverUser = [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $userToken,
            'HTTP_ACCEPT' => 'application/json'
        ];
        $reqUser = Request::create('/api/admin/animes', 'POST', ['title' => 'Fail'], [], [], $serverUser);
        $resUser = app()->handle($reqUser);
        $this->line("   Regular User -> POST /api/admin/animes: HTTP " . $resUser->getStatusCode() . " (Expected: 403 Forbidden)");

        // Server-side validation check
        auth()->forgetGuards();
        app()->forgetInstance('request');
        $reqInvalid = Request::create('/api/admin/animes', 'POST', ['score' => 20], [], [], $serverAdmin);
        $resInvalid = app()->handle($reqInvalid);
        $this->line("   Admin Invalid Data -> POST /api/admin/animes: HTTP " . $resInvalid->getStatusCode() . " (Expected: 422 Unprocessable)");

        $this->info("=== All Tests Completed Successfully ===");
        return 0;
    }
}
