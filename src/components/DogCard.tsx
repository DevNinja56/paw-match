import React from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import type { Dog } from '../lib/types';
import type { RootState } from '../store/store';

interface DogCardProps {
  dog: Dog;
  isLoading?: boolean;
}

export function DogCard({ dog, isLoading = false }: DogCardProps) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = favorites.some((fav) => fav.id === dog.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(dog.id));
      toast.success(`${dog.name} removed from favorites`);
    } else {
      dispatch(addFavorite(dog));
      toast.success(`${dog.name} added to favorites`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-primary-950 text-primary-950' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{dog.name}</h3>
        <p className="text-gray-600">{dog.breed}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-500">{dog.age} years old</span>
          <span className="text-sm text-gray-500">{dog.zip_code}</span>
        </div>
      </div>
    </div>
  );
}