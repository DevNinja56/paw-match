import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './slices/authSlice';
import { favoritesReducer } from './slices/favoritesSlice';
import { searchReducer } from './slices/searchSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'favorites', 'search'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedFavoritesReducer = persistReducer(persistConfig, favoritesReducer);
const persistedSearchReducer = persistReducer(persistConfig, searchReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    favorites: persistedFavoritesReducer,
    search: persistedSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;