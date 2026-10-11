import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import AnimeCard from '../components/AnimeCard';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Database, Globe, WifiOff, Sparkles } from 'lucide-react';
import { fetchApi } from '../utils/api';

const fallbackDataset = [
  {
    id: 1,
    title: "Frieren: Beyond Journey's End",
    poster_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-n1MjsjhnAyyM.jpg",
    score: 9.3,
    episodes: 28,
    status: "completed",
    genre: { name: "Fantasy" }
  },
  {
    id: 2,
    title: "Attack on Titan",
    poster_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-73IhOXpJZiMF.jpg",
    score: 9.0,
    episodes: 89,
    status: "completed",
    genre: { name: "Action" }
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    poster_image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg",
    score: 8.6,
    episodes: 47,
    status: "ongoing",
    genre: { name: "Shounen" }
  }
];

const Browse = ({ setActiveView }) => {
  // Data source: 'database' (Laravel MySQL API) or 'kitsu' (Project 1 Third-Party API)
  const [dataSource, setDataSource] = useState('database');

  // State for data
  const [animeList, setAnimeList] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // State for user inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('score');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Load available genres from Laravel MySQL database
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await fetchApi('/genres');
        setGenresList(data || []);
      } catch (err) {
        console.warn('Could not fetch genres from backend:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch anime based on current data source and filter options
  const fetchAnime = async () => {
    setLoading(true);
    setError(null);
    setIsOfflineMode(false);

    try {
      if (dataSource === 'database') {
        // GET from Laravel Backend MySQL API (/api/animes)
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);
        if (sort) params.append('sort', sort);
        if (filter !== 'All') params.append('status', filter.toLowerCase());

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const data = await fetchApi(`/animes${queryStr}`);
        setAnimeList(data || []);
      } else {
        // GET from Kitsu Edge API (Project 1 live catalog)
        let url = 'https://kitsu.io/api/edge/anime';
        const params = new URLSearchParams();
        params.append('page[limit]', '20');
        params.append('include', 'categories');

        if (searchTerm) params.append('filter[text]', searchTerm);
        if (selectedGenre !== 'All') params.append('filter[categories]', selectedGenre);

        if (sort === 'score') params.append('sort', '-averageRating');
        else if (sort === 'newest') params.append('sort', '-startDate');
        else if (sort === 'oldest') params.append('sort', 'startDate');

        const response = await fetch(`${url}?${params.toString()}`, {
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch from Kitsu (${response.status})`);
        }

        const responseData = await response.json();
        const animesWithGenres = (responseData.data || []).map(anime => {
          if (anime.relationships?.categories?.data?.length > 0 && responseData.included) {
            const categoryId = anime.relationships.categories.data[0].id;
            const categoryObj = responseData.included.find(inc => inc.type === 'categories' && inc.id === categoryId);
            if (categoryObj) {
              anime.attributes.categories = [categoryObj.attributes.title];
            }
          }
          return anime;
        });

        setAnimeList(animesWithGenres);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to fetch catalog from backend");
      setAnimeList(fallbackDataset);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [dataSource, searchTerm, filter, sort, selectedGenre]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const availableGenres = ['All', ...genresList.map(g => g.name)];

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Browse Anime</h1>
          <p className="text-slate-400">
            {dataSource === 'database' 
              ? 'Displaying normalized relational anime data from MySQL via Laravel Eloquent GET /api/animes.'
              : 'Live explorer powered by Kitsu API. Add any anime to instantly cache into MySQL.'}
          </p>
        </div>

        {/* Source Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setDataSource('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              dataSource === 'database'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            MySQL Database (Laravel)
          </button>
          <button
            onClick={() => setDataSource('kitsu')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              dataSource === 'kitsu'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            Kitsu Live Feed
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="space-y-6 mb-8">
        <SearchBar onSearch={handleSearch} />

        {/* Dynamic Category Badges */}
        <div className="overflow-x-auto no-scrollbar py-2 flex gap-2">
          {availableGenres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm ${
                selectedGenre === genre
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-indigo-500 hover:text-white transition duration-150'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <FilterBar 
          currentFilter={filter} 
          onFilterChange={setFilter}
          currentSort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="mb-8 flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-yellow-500">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium text-sm">
              ⚠️ Offline Mode: Showing cached catalog (Ensure Laravel `php artisan serve` is running)
            </span>
          </div>
          <button
            onClick={fetchAnime}
            className="px-4 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-medium rounded-lg transition-colors"
          >
            Retry Live API
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-grow">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAnime} />
        ) : animeList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8">
            <h3 className="text-xl text-slate-300 font-medium">No anime found in this selection.</h3>
            <p className="text-slate-500 mt-2 text-sm">
              Try adjusting your search or filters, or toggle to Kitsu Live Feed to explore new titles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} setActiveView={setActiveView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
