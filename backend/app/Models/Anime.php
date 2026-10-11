<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anime extends Model
{
    protected $fillable = [
        'genre_id',
        'title',
        'synopsis',
        'episodes',
        'score',
        'poster_image',
        'status',
    ];

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function watchlists()
    {
        return $this->hasMany(Watchlist::class);
    }
}
