import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  // Controlled input state
  const [query, setQuery] = useState('');

  // Handle synthetic form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center w-full h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        <div className="grid place-items-center h-full w-12 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-slate-100 bg-transparent pr-2 placeholder-slate-400"
          type="text"
          id="search"
          placeholder="Search for anime by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        /> 

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="grid place-items-center h-full w-12 text-slate-400 hover:text-white transition-colors"
            aria-label="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <button
          type="submit"
          className="h-full px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
