import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Plus, Edit2, Trash2, ShieldCheck, Film, Star, CheckCircle, AlertCircle, X } from 'lucide-react';

const AdminCatalog = ({ user }) => {
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    genre_id: '',
    synopsis: '',
    episodes: 12,
    score: 8.0,
    poster_image: '',
    status: 'ongoing',
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [animeRes, genreRes] = await Promise.all([
        fetchApi('/animes'),
        fetchApi('/genres')
      ]);
      setAnimes(animeRes);
      setGenres(genreRes);
      if (genreRes.length > 0 && !formData.genre_id) {
        setFormData(prev => ({ ...prev, genre_id: genreRes[0].id }));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load catalog data from Laravel backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      genre_id: genres[0]?.id || ''
    });
    setActionError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (anime) => {
    setEditingId(anime.id);
    setFormData({
      title: anime.title || '',
      genre_id: anime.genre_id || (genres[0]?.id || ''),
      synopsis: anime.synopsis || '',
      episodes: anime.episodes || 0,
      score: anime.score || 0,
      poster_image: anime.poster_image || '',
      status: anime.status || 'ongoing',
    });
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError(null);

    const payload = {
      title: formData.title,
      genre_id: parseInt(formData.genre_id, 10),
      synopsis: formData.synopsis,
      episodes: parseInt(formData.episodes, 10) || 0,
      score: parseFloat(formData.score) || 0,
      poster_image: formData.poster_image,
      status: formData.status,
    };

    try {
      if (editingId) {
        // UPDATE (PUT)
        const updated = await fetchApi(`/admin/animes/${editingId}`, {
          method: 'PUT',
          body: payload
        });
        setAnimes(animes.map(a => a.id === editingId ? updated : a));
        showToast('Anime successfully updated in MySQL database! ✨');
      } else {
        // CREATE (POST)
        const created = await fetchApi('/admin/animes', {
          method: 'POST',
          body: payload
        });
        setAnimes([created, ...animes]);
        showToast('New anime created and persisted to MySQL database! 🎉');
      }
      setIsModalOpen(false);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}" from the database catalog? This will cascade delete any watchlist references.`)) {
      return;
    }

    try {
      setActionError(null);
      await fetchApi(`/admin/animes/${id}`, {
        method: 'DELETE'
      });
      setAnimes(animes.filter(a => a.id !== id));
      showToast(`"${title}" deleted from MySQL! 🗑️`);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-16 text-center">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-md mx-auto">
          <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied (403 Forbidden)</h2>
          <p className="text-slate-400 text-sm mb-4">
            Role-Based Authorization: You need an administrator account to view or modify the backend catalog.
          </p>
          <p className="text-xs text-indigo-400">
            Log in with <b>admin@example.com</b> (password: password) to test Admin capabilities.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-12"><Loading /></div>;
  if (error) return <div className="p-8 max-w-5xl mx-auto"><ErrorState message={error} onRetry={loadData} /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
            <ShieldCheck className="w-4 h-4" /> Role-Based Access: Administrator
          </div>
          <h1 className="text-3xl font-bold text-white">Database Catalog Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Perform full CRUD operations on the MySQL <code className="text-indigo-300">animes</code> table through Laravel Eloquent.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add New Anime
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-sm font-medium">{actionError}</span>
        </div>
      )}

      {/* Database Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{animes.length}</div>
            <div className="text-xs text-slate-400">Total Titles in MySQL</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{genres.length}</div>
            <div className="text-xs text-slate-400">Relational Genres</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {animes.length > 0 
                ? (animes.reduce((acc, a) => acc + (parseFloat(a.score) || 0), 0) / animes.length).toFixed(1)
                : '0.0'}
            </div>
            <div className="text-xs text-slate-400">Average Database Score</div>
          </div>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Cover & Title</th>
                <th className="px-6 py-4">Genre (Relation)</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Episodes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {animes.map((anime) => (
                <tr key={anime.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img 
                      src={anime.poster_image || 'https://via.placeholder.com/60x85?text=No+Cover'} 
                      alt={anime.title} 
                      className="w-10 h-14 object-cover rounded-md bg-slate-950 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-white">{anime.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{anime.synopsis || 'No synopsis'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {anime.genre?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-400">
                    ★ {anime.score || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
                      anime.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {anime.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(anime)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition mr-2"
                      title="Edit Anime Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(anime.id, anime.title)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete Anime Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingId ? 'Edit Anime Record' : 'Add New Anime to MySQL'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Requires Admin Privileges. Tested against Laravel server-side validation.
            </p>

            {actionError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs">
                ⚠️ {actionError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Anime Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Attack on Titan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Genre (Relational Foreign Key) *
                  </label>
                  <select
                    required
                    value={formData.genre_id}
                    onChange={e => setFormData({ ...formData, genre_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {genres.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Score (0.0 to 10.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.score}
                    onChange={e => setFormData({ ...formData, score: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Total Episodes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.episodes}
                    onChange={e => setFormData({ ...formData, episodes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Poster Image URL
                </label>
                <input
                  type="text"
                  value={formData.poster_image}
                  onChange={e => setFormData({ ...formData, poster_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Synopsis
                </label>
                <textarea
                  rows="3"
                  value={formData.synopsis}
                  onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="Summary of the anime series..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition shadow-md shadow-indigo-600/30 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingId ? 'Update Record' : 'Save to MySQL')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;
