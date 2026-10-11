<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Genre;

class GenreController extends Controller
{
    /**
     * Display a listing of genres.
     */
    public function index()
    {
        return response()->json(Genre::withCount('animes')->orderBy('name')->get());
    }
}
