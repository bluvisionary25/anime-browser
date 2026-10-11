import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Trash2, Plus, Minus, ChevronDown } from 'lucide-react';

import { fetchApi } from '../utils/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/watchlist');
      setWatchlist(data || []);
    } catch (err) {
      console.error(err);
      if (err.message?.includes('Unauthenticated') || err.message?.includes('401')) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError(err.message || 'Could not connect to the server. Make sure the Laravel API is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleUpdateProgress = async (id, currentProgress, change) => {
    const newProgress = currentProgress + change;
    if (newProgress < 0) return;

    try {
      setActionError(null);
      await fetchApi(`/watchlist/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ progress_episodes: newProgress })
      });

      setWatchlist(watchlist.map(item => 
        item.id === id ? { ...item, progress_episodes: newProgress } : item
      ));
    } catch (err) {
      setActionError(err.message);
      setTimeout(() => setActionError(null), 5000);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionError(null);
      await fetchApi(`/watchlist/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      setWatchlist(watchlist.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      setActionError(err.message);
      setTimeout(() => setActionError(null), 5000);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this anime from your watchlist?")) return;

    try {
      setActionError(null);
      await fetchApi(`/watchlist/${id}`, {
        method: 'DELETE'
      });

      setWatchlist(watchlist.filter(item => item.id !== id));
    } catch (err) {
      setActionError(err.message);
      setTimeout(() => setActionError(null), 5000);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'watching': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'plan_to_watch': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) return <div className="p-8"><Loading /></div>;
  if (error) return <div className="p-8"><ErrorState message={error} onRetry={fetchWatchlist} /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-slate-400">Track your progress for your saved anime.</p>
      </div>

      {actionError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-white transition">
            <Trash2 className="w-4 h-4 opacity-0" />
            <span className="text-sm font-bold">×</span>
          </button>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
          <h3 className="text-xl text-slate-300 font-medium">Your watchlist is empty</h3>
          <p className="text-slate-500 mt-2">Browse for anime and add them to your watchlist to track your progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <div key={item.id} className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 flex flex-row shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800/80 overflow-hidden">
              
              {/* Poster Image */}
              <div className="relative w-28 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={item.anime?.poster_image || 'https://via.placeholder.com/150x225?text=No+Image'} 
                  alt={item.anime?.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="ml-5 flex flex-col flex-grow justify-between py-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-100 line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors" title={item.anime?.title}>
                      {item.anime?.title || 'Unknown Anime'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      {item.anime?.genre?.name && (
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          {item.anime?.genre?.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Status Dropdown */}
                <div className="mt-4">
                  <div className="relative inline-block w-full max-w-[140px]">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className={`w-full appearance-none text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${getStatusColor(item.status)}`}
                    >
                      <option value="watching" className="bg-slate-900 text-white">Watching</option>
                      <option value="completed" className="bg-slate-900 text-white">Completed</option>
                      <option value="plan_to_watch" className="bg-slate-900 text-white">Plan to Watch</option>
                    </select>
                    <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${getStatusColor(item.status).split(' ')[1]}`} />
                  </div>
                </div>

                {/* Progress Control */}
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Progress</div>
                  <div className="flex items-center bg-slate-950/80 rounded-lg border border-slate-800 overflow-hidden shadow-inner">
                    <button 
                      onClick={() => handleUpdateProgress(item.id, item.progress_episodes, -1)}
                      disabled={item.progress_episodes <= 0}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="font-mono text-sm font-bold text-slate-200 px-3 min-w-[3.5rem] text-center">
                      {item.progress_episodes} {item.anime?.episodes ? <span className="text-slate-500">/ {item.anime.episodes}</span> : ''}
                    </div>
                    <button 
                      onClick={() => handleUpdateProgress(item.id, item.progress_episodes, 1)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
