import React, { useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFavorites } from '../store/slices/favoritesSlice';
import { DogCard } from '../components/DogCard';
import { generateMatch } from '../lib/api';
import type { Dog } from '../lib/types';
import type { RootState } from '../store/store';

export function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      toast.error('Add some dogs to your favorites first!');
      return;
    }

    setIsGenerating(true);
    try {
      const matchId = await generateMatch(favorites.map((dog) => dog.id));
      const matched = favorites.find((dog) => dog.id === matchId);
      if (matched) {
        setMatchedDog(matched);
        toast.success("We've found your perfect match!");
      }
    } catch (error) {
      toast.error('Failed to generate match');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      dispatch(clearFavorites());
      setMatchedDog(null);
      toast.success('Favorites cleared');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Favorite Dogs ({favorites.length})
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleGenerateMatch}
            disabled={isGenerating || favorites.length === 0}
            className="w-full sm:w-auto px-4 py-2 bg-primary-950 text-white text-sm sm:text-base rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Match'}
          </button>
          {favorites.length > 0 && (
            <button
              onClick={handleClearFavorites}
              className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors text-sm sm:text-base"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {matchedDog && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-primary-50 rounded-lg border border-primary-200">
          <h2 className="text-lg sm:text-xl font-semibold text-primary-950 mb-4">
            🎉 Your Perfect Match!
          </h2>
          <div className="max-w-sm mx-auto">
            <DogCard dog={matchedDog} />
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            You haven't added any dogs to your favorites yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}