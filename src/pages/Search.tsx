import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { getBreeds, searchDogs, getDogs } from '../lib/api';
import { DogCard } from '../components/DogCard';
import { SearchFilters } from '../components/SearchFilters';
import { Pagination } from '../components/Pagination';
import { cacheSearchResults } from '../store/slices/searchSlice';
import type { Dog } from '../lib/types';
import type { RootState } from '../store/store';
import { isCacheValid } from '../store/slices/searchSlice';

const PAGE_SIZE = 20;

export function Search() {
  const dispatch = useDispatch();
  const cachedResults = useSelector((state: RootState) => state.search.cachedResults);
  
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]);
  const [sortBy, setSortBy] = useState('breed:asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getCacheKey = useCallback(() => {
    return `${selectedBreeds.join(',')}-${ageRange.join(',')}-${sortBy}-${currentPage}`;
  }, [selectedBreeds, ageRange, sortBy, currentPage]);

  const { data: breeds = [] } = useQuery({
    queryKey: ['breeds'],
    queryFn: getBreeds,
  });

  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['dogs', selectedBreeds, ageRange, sortBy, currentPage],
    queryFn: async () => {
      try {
        const cacheKey = getCacheKey();
        const cached = cachedResults[cacheKey];

        if (cached && isCacheValid(cached.timestamp)) {
          setDogs(cached.dogs);
          return { resultIds: cached.dogs.map(d => d.id), total: cached.total };
        }

        const response = await searchDogs({
          breeds: selectedBreeds,
          ageMin: ageRange[0],
          ageMax: ageRange[1],
          sort: sortBy,
          size: PAGE_SIZE,
          from: (currentPage - 1) * PAGE_SIZE,
        });

        if (!response?.resultIds) {
          throw new Error('No results found');
        }

        return response;
      } catch (error) {
        console.error('Search error:', error);
        return { resultIds: [], total: 0 };
      }
    },
    enabled: true,
  });

  useEffect(() => {
    const fetchDogs = async () => {
      if (!searchResults?.resultIds?.length) {
        setDogs([]);
        setFilteredDogs([]);
        return;
      }

      setIsSearching(true);
      try {
        const fetchedDogs = await getDogs(searchResults.resultIds);
        const cacheKey = getCacheKey();
        
        dispatch(
          cacheSearchResults({
            key: cacheKey,
            dogs: fetchedDogs,
            total: searchResults.total,
          })
        );
        
        setDogs(fetchedDogs);
        
        if (searchTerm) {
          const normalizedTerm = searchTerm.toLowerCase().trim();
          const filtered = fetchedDogs.filter((dog) => {
            const normalizedName = dog.name.toLowerCase();
            const normalizedBreed = dog.breed.toLowerCase();
            return (
              normalizedName.includes(normalizedTerm) ||
              normalizedBreed.includes(normalizedTerm)
            );
          });
          setFilteredDogs(filtered);
        } else {
          setFilteredDogs(fetchedDogs);
        }
      } catch (error) {
        console.error('Error fetching dogs:', error);
        setDogs([]);
        setFilteredDogs([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchDogs();
  }, [searchResults, dispatch, getCacheKey, searchTerm]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim()) {
        setFilteredDogs(dogs);
        return;
      }

      const normalizedTerm = term.toLowerCase().trim();
      const filtered = dogs.filter((dog) => {
        const normalizedName = dog.name.toLowerCase();
        const normalizedBreed = dog.breed.toLowerCase();
        return (
          normalizedName.includes(normalizedTerm) ||
          normalizedBreed.includes(normalizedTerm)
        );
      });
      setFilteredDogs(filtered);
    }, 300),
    [dogs]
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const displayDogs = searchTerm ? filteredDogs : dogs;
  const totalItems = searchResults?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <SearchFilters
        breeds={breeds}
        selectedBreeds={selectedBreeds}
        onBreedsChange={setSelectedBreeds}
        ageRange={ageRange}
        onAgeRangeChange={setAgeRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSearch={() => {
          setCurrentPage(1);
          refetch();
        }}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {(isLoading || isSearching) ? (
          Array.from({ length: 8 }).map((_, i) => (
            <DogCard key={i} dog={{} as Dog} isLoading={true} />
          ))
        ) : displayDogs.length > 0 ? (
          displayDogs.map((dog) => <DogCard key={dog.id} dog={dog} />)
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No dogs found matching your search criteria.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && !isLoading && !isSearching && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}