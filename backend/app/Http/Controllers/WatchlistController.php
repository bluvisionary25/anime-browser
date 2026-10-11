<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Watchlist;
use Illuminate\Validation\Rule;

class WatchlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $watchlists = Watchlist::with('anime.genre')
            ->where('user_id', auth()->id())
            ->get();
        return response()->json($watchlists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anime_id' => 'nullable|exists:animes,id',
            'kitsu_title' => 'nullable|string',
            'kitsu_synopsis' => 'nullable|string',
            'kitsu_episodes' => 'nullable|integer',
            'kitsu_score' => 'nullable|numeric',
            'kitsu_poster_image' => 'nullable|string',
            'kitsu_genre' => 'nullable|string',
            'status' => ['required', Rule::in(['watching', 'completed', 'plan_to_watch'])],
            'progress_episodes' => 'integer|min:0',
        ]);

        $animeId = $request->anime_id;

        if (!$animeId && $request->has('kitsu_title')) {
            $genreName = $request->kitsu_genre ?: 'Unknown';
            $genre = \App\Models\Genre::firstOrCreate(
                ['name' => $genreName],
                ['slug' => \Illuminate\Support\Str::slug($genreName)]
            );

            $anime = \App\Models\Anime::firstOrCreate(
                ['title' => $request->kitsu_title],
                [
                    'genre_id' => $genre->id,
                    'synopsis' => $request->kitsu_synopsis ?? 'No synopsis available.',
                    'episodes' => $request->kitsu_episodes ?? 0,
                    'score' => $request->kitsu_score ?? 0,
                    'poster_image' => $request->kitsu_poster_image ?? '',
                    'status' => 'ongoing',
                ]
            );
            $animeId = $anime->id;
        }

        if (!$animeId) {
            return response()->json(['message' => 'Anime ID or Kitsu title required'], 422);
        }

        $watchlist = Watchlist::create([
            'user_id' => auth()->id(),
            'anime_id' => $animeId,
            'status' => $validated['status'],
            'progress_episodes' => $validated['progress_episodes'] ?? 0,
        ]);
        
        $watchlist->load('anime.genre');

        return response()->json($watchlist, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Watchlist $watchlist)
    {
        if ($watchlist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(['watching', 'completed', 'plan_to_watch'])],
            'progress_episodes' => 'sometimes|integer|min:0',
        ]);

        $watchlist->update($validated);

        return response()->json($watchlist);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Watchlist $watchlist)
    {
        if ($watchlist->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $watchlist->delete();
        return response()->json(null, 204);
    }
}
