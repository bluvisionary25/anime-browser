<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnimeController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GenreController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication routes
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// Also keep root /register and /login for backwards-compatibility
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Catalog & Genre browsing (READ)
Route::name('animes.')->group(function () {
    Route::get('/animes', [AnimeController::class, 'index'])->name('index');
    Route::get('/animes/{anime}', [AnimeController::class, 'show'])->name('show');
});

Route::get('/genres', [GenreController::class, 'index'])->name('genres.index');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (User & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    })->name('user.profile');

    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout.prefixed');

    // Watchlist CRUD resource routes (index, store, update, destroy)
    Route::apiResource('watchlist', WatchlistController::class)->except(['show']);

    /*
    |--------------------------------------------------------------------------
    | Role-Based Authorization: Admin Only Routes
    |--------------------------------------------------------------------------
    | Only users with role === 'admin' can create, update, or delete anime catalog entries.
    */
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::post('/animes', [AnimeController::class, 'store'])->name('animes.store');
        Route::put('/animes/{anime}', [AnimeController::class, 'update'])->name('animes.update');
        Route::delete('/animes/{anime}', [AnimeController::class, 'destroy'])->name('animes.destroy');
    });

    // Also support standard REST endpoints protected by admin middleware
    Route::middleware('admin')->group(function () {
        Route::post('/animes', [AnimeController::class, 'store'])->name('animes.store.direct');
        Route::put('/animes/{anime}', [AnimeController::class, 'update'])->name('animes.update.direct');
        Route::delete('/animes/{anime}', [AnimeController::class, 'destroy'])->name('animes.destroy.direct');
    });
});
