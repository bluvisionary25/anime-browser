import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

const FilterBar = ({ currentFilter, onFilterChange, currentSort, onSortChange }) => {
  const filters = [
    { id: 'All', label: 'All Formats' },
    { id: 'TV', label: 'TV' },
    { id: 'Movie', label: 'Movie' },
    { id: 'OVA', label: 'OVA' },
  ];

  const sorts = [
    { id: 'score', label: 'Highest Score' },
    { id: 'members', label: 'Popularity' }, // Jikan API uses 'members' or 'scored_by' for popularity
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 w-full mb-8">
      {/* Filters */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
                currentFilter === filter.id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-400'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-700/50 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none cursor-pointer"
        >
          {sorts.map((sort) => (
             <option key={sort.id} value={sort.id} className="bg-slate-800">
               {sort.label}
             </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
