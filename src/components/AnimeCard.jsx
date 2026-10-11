import React, { useState } from 'react';
import { Star, Tv, Film, PlayCircle, X, BookmarkPlus, LogIn } from 'lucide-react';
import { fetchApi } from '../utils/api';

const AnimeCard = ({ anime, setActiveView }) => {
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  // Support both Kitsu JSON:API and our new Laravel API format
  const isKitsu = !!anime.attributes;
  const attributes = isKitsu ? anime.attributes : anime;
  
  const title = isKitsu ? attributes.canonicalTitle : attributes.title;
  const posterUrl = isKitsu 
    ? (attributes.posterImage?.small || attributes.posterImage?.original || "") 
    : attributes.poster_image;
  const rawScore = isKitsu ? attributes.averageRating : attributes.score;
  const score = isKitsu && rawScore ? (parseFloat(rawScore) / 10).toFixed(1) : rawScore;
  const type = (isKitsu ? attributes.subtype : attributes.type)?.toUpperCase() || "TV";
  const episodes = isKitsu ? attributes.episodeCount : attributes.episodes;
  
  // Extract genre if available
  let genre = null;
  if (isKitsu) {
    if (attributes.categories) {
      genre = Array.isArray(attributes.categories) ? attributes.categories[0] : attributes.categories;
    } else if (attributes.genres) {
      genre = Array.isArray(attributes.genres) ? attributes.genres[0] : attributes.genres;
    }
  } else {
    // Laravel eager loaded relation
    genre = anime.genre?.name;
  }

  const year = isKitsu 
    ? (attributes.startDate ? attributes.startDate.substring(0, 4) : null) 
    : attributes.year;
  const synopsis = attributes.synopsis || "No synopsis available.";
  const url = isKitsu ? `https://kitsu.io/anime/${anime.id}` : '#';

  const [toastMessage, setToastMessage] = useState('');

  const addToWatchlist = async (e) => {
    e.stopPropagation();
    
    if (!token) {
      setToastMessage("Please sign in first to save anime to your Watchlist! 🔒");
      setTimeout(() => setToastMessage(''), 3500);
      return;
    }

    try {
      const payload = {
        status: 'plan_to_watch',
        progress_episodes: 0
      };

      if (isKitsu) {
        // Send flat Kitsu data to backend so it can be cached locally
        // using flat structure because URLSearchParams stringifies nested objects to [object Object]
        payload.kitsu_title = title;
        payload.kitsu_synopsis = synopsis;
        payload.kitsu_episodes = episodes || 0;
        payload.kitsu_score = rawScore || 0;
        payload.kitsu_poster_image = posterUrl;
        payload.kitsu_genre = genre || 'Unknown';
      } else {
        payload.anime_id = anime.id;
      }

      await fetchApi('/watchlist', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setToastMessage("Added to your Watchlist! ✅");
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setToastMessage(`Error: ${err.message}`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Render type icon based on format
  const TypeIcon = () => {
    if (type === 'TV') return <Tv className="w-3 h-3 mr-1" />;
    if (type === 'MOVIE') return <Film className="w-3 h-3 mr-1" />;
    return <PlayCircle className="w-3 h-3 mr-1" />;
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition duration-200 hover:-translate-y-1 hover:border-indigo-500/50 cursor-pointer"
      >
        {/* Poster Image */}
        <div className="relative h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={posterUrl}
            alt={title}
            className="h-72 w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {score && (
              <div className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {score}
              </div>
            )}
            {episodes && (
              <div className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-md flex items-center">
                {episodes} ep{episodes > 1 ? 's' : ''}
              </div>
            )}
            {genre && (
              <div className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                {genre}
              </div>
            )}
          </div>

          {/* Title (Line-clamped) */}
          <h3 className="font-bold text-slate-100 text-sm mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors" title={title}>
            {title}
          </h3>
          
          {/* Tags and Meta */}
          <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center bg-slate-800 px-2 py-1 rounded">
              <TypeIcon />
              <span>{type}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {year && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span>{year}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2 pr-8">{title}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              {score && (
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {score}
                </div>
              )}
              {episodes && <span className="text-slate-400 text-sm">{episodes} Episodes</span>}
              {year && <span className="text-slate-400 text-sm">{year}</span>}
            </div>

            <div className="prose prose-invert prose-slate text-slate-300 text-sm mb-6 whitespace-pre-wrap">
              {synopsis}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
                onClick={(e) => { if (!isKitsu) e.preventDefault(); }}
              >
                {isKitsu ? "View on Kitsu" : "Local Anime"}
              </a>
              {token ? (
                <button 
                  onClick={addToWatchlist}
                  className="inline-flex items-center justify-center flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-indigo-600/20"
                >
                  <BookmarkPlus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                    if (setActiveView) setActiveView('auth');
                  }}
                  className="inline-flex items-center justify-center flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-medium rounded-lg transition-colors"
                  title="Sign in required to save to Watchlist"
                >
                  <LogIn className="w-5 h-5 mr-2 text-indigo-400" />
                  Sign In to Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-2xl z-[60] flex items-center animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default AnimeCard;
