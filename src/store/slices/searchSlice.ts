import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dog } from '../../lib/types';

interface CachedResult {
  dogs: Dog[];
  timestamp: number;
  total: number;
}

interface SearchState {
  cachedResults: {
    [key: string]: CachedResult;
  };
}

const initialState: SearchState = {
  cachedResults: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    cacheSearchResults: (
      state,
      action: PayloadAction<{
        key: string;
        dogs: Dog[];
        total: number;
      }>
    ) => {
      const { key, dogs, total } = action.payload;
      // Ensure the data is serializable before storing
      const serializedDogs = JSON.parse(JSON.stringify(dogs));
      state.cachedResults[key] = {
        dogs: serializedDogs,
        total,
        timestamp: Date.now(),
      };
    },
    clearCache: (state) => {
      state.cachedResults = {};
    },
  },
});

export const { cacheSearchResults, clearCache } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;

export const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};