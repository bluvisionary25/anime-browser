<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Anime;

class AnimeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Anime::with('genre');

        if ($request->filled('genre') && $request->genre !== 'All') {
            $query->whereHas('genre', function ($q) use ($request) {
                $q->where('slug', $request->genre)
                  ->orWhere('name', $request->genre);
            });
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('synopsis', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        // Sorting
        $sort = $request->get('sort', 'score');
        if ($sort === 'score') {
            $query->orderByDesc('score');
        } elseif ($sort === 'newest') {
            $query->orderByDesc('created_at');
        } elseif ($sort === 'oldest') {
            $query->orderBy('created_at');
        } elseif ($sort === 'title') {
            $query->orderBy('title');
        } else {
            $query->orderByDesc('score');
        }

        return response()->json($query->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(Anime $anime)
    {
        $anime->load('genre');
        return response()->json($anime);
    }

    /**
     * Store a newly created anime in storage (Admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'genre_id' => 'required|exists:genres,id',
            'synopsis' => 'nullable|string',
            'episodes' => 'nullable|integer|min:0',
            'score' => 'nullable|numeric|min:0|max:10',
            'poster_image' => 'nullable|string',
            'status' => 'required|in:ongoing,completed',
        ]);

        $anime = Anime::create($validated);
        $anime->load('genre');

        return response()->json($anime, 201);
    }

    /**
     * Update the specified anime in storage (Admin only).
     */
    public function update(Request $request, Anime $anime)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'genre_id' => 'sometimes|required|exists:genres,id',
            'synopsis' => 'nullable|string',
            'episodes' => 'nullable|integer|min:0',
            'score' => 'nullable|numeric|min:0|max:10',
            'poster_image' => 'nullable|string',
            'status' => 'sometimes|required|in:ongoing,completed',
        ]);

        $anime->update($validated);
        $anime->load('genre');

        return response()->json($anime);
    }

    /**
     * Remove the specified anime from storage (Admin only).
     */
    public function destroy(Anime $anime)
    {
        $anime->delete();
        return response()->json(null, 204);
    }
}
