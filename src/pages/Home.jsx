import React, { useState, useEffect } from 'react';
import { PlayCircle, TrendingUp, Users, Star, ArrowRight } from 'lucide-react';

const Home = ({ setActiveView }) => {
  const [trendingAnime, setTrendingAnime] = useState(null);

  useEffect(() => {
    // Fetch top anime for the hero banner using Kitsu API
    const fetchTrending = async () => {
      try {
        const response = await fetch('https://kitsu.io/api/edge/anime?page[limit]=1&sort=-averageRating');
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setTrendingAnime(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch trending anime:", error);
      }
    };
    
    fetchTrending();
  }, []);

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {trendingAnime ? (
            <img 
              src={trendingAnime.attributes.posterImage?.original || trendingAnime.attributes.posterImage?.large} 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-slate-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
              <span>Discover Trending Anime</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tight leading-tight">
              Your Gateway to the Anime Universe
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl">
              Explore thousands of anime titles, discover hidden gems, and track your favorites with real-time data powered by Kitsu.
            </p>
            
            <div className="pt-4">
              <button
                onClick={() => setActiveView('browse')}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_8px_rgba(99,102,241,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Browsing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
          
          {/* Featured Anime Card (if loaded) */}
          {trendingAnime && (
            <div className="hidden md:block flex-shrink-0 animate-[float_6s_ease-in-out_infinite]">
              <div className="relative w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 shadow-indigo-500/20 group">
                <img 
                  src={trendingAnime.attributes.posterImage?.small || trendingAnime.attributes.posterImage?.original} 
                  alt={trendingAnime.attributes.canonicalTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                   <p className="text-white font-bold truncate">{trendingAnime.attributes.canonicalTitle}</p>
                   <p className="text-indigo-300 text-sm flex items-center gap-1">
                     <Star className="w-3 h-3 fill-current" /> 
                     {trendingAnime.attributes.averageRating ? (trendingAnime.attributes.averageRating / 10).toFixed(1) : "N/A"}
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-4xl font-black text-white mb-2">25K+</h3>
              <p className="text-slate-400 text-center font-medium">Anime Titles Available</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-4xl font-black text-white mb-2">Live</h3>
              <p className="text-slate-400 text-center font-medium">Community Ratings</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-4xl font-black text-white mb-2">Top</h3>
              <p className="text-slate-400 text-center font-medium">Trending & Upcoming</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
