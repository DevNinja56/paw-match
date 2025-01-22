import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
  ageRange: [number, number];
  onAgeRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSearch: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchFilters({
  breeds,
  selectedBreeds,
  onBreedsChange,
  ageRange,
  onAgeRangeChange,
  sortBy,
  onSortChange,
  onSearch,
  searchTerm,
  onSearchChange,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    if (index === 0) {
      onAgeRangeChange([value, Math.max(value, ageRange[1])]);
    } else {
      onAgeRangeChange([Math.min(ageRange[0], value), value]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchTerm}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-950 focus:border-primary-950"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-primary-950 text-primary-950 hover:bg-primary-50 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Advanced Filters</span>
          {showFilters ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 border-t border-gray-200 pt-4 sm:pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
              Age Range: {ageRange[0]} - {ageRange[1]} years
            </label>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={ageRange[0]}
                  onChange={(e) => handleRangeChange(e, 0)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={ageRange[1]}
                  onChange={(e) => handleRangeChange(e, 1)}
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer range-slider"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 years</span>
                <span>20 years</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-950 focus:border-primary-950"
            >
              <option value="breed:asc">Breed (A-Z)</option>
              <option value="breed:desc">Breed (Z-A)</option>
              <option value="age:asc">Age (Youngest First)</option>
              <option value="age:desc">Age (Oldest First)</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
            </select>
          </div>

          <button
            onClick={onSearch}
            className="w-full py-2.5 sm:py-3 px-4 bg-primary-950 text-white text-sm sm:text-base rounded-lg hover:bg-primary-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}