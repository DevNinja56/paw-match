import axios from 'axios';
import type { Dog, SearchResponse } from './types';

const API_URL = 'https://frontend-take-home-service.fetch.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure all error objects are serializable
const serializeError = (error: any) => {
  if (error.message === 'Network Error') {
    // Return a more user-friendly error for network issues
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      status: 0,
      data: null,
    };
  }
  return {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  };
};

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If it's a 401 error, redirect to login
    if (error.response?.status === 401) {
      window.location.href = '/login';
      return Promise.reject(serializeError(error));
    }

    // For network errors or 5xx errors, retry up to 3 times with exponential backoff
    if (
      (error.message === 'Network Error' || 
       (error.response && error.response.status >= 500)) &&
      (!error.config._retryCount || error.config._retryCount < 3)
    ) {
      error.config._retryCount = (error.config._retryCount || 0) + 1;
      const delay = Math.pow(2, error.config._retryCount) * 1000; // Exponential backoff
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(error.config);
    }

    return Promise.reject(serializeError(error));
  }
);

const handleApiError = (error: any, context: string) => {
  const serializedError = serializeError(error);
  console.error(`${context}:`, serializedError);
  throw serializedError;
};

export const login = async (name: string, email: string) => {
  try {
    const response = await api.post('/auth/login', { name, email });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login error');
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    handleApiError(error, 'Logout error');
  }
};

export const getBreeds = async (): Promise<string[]> => {
  try {
    const { data } = await api.get('/dogs/breeds');
    return data;
  } catch (error) {
    handleApiError(error, 'Get breeds error');
  }
};

export const searchDogs = async (params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<SearchResponse> => {
  try {
    // Ensure params are serializable
    const serializedParams = JSON.parse(JSON.stringify(params));
    const { data } = await api.get('/dogs/search', { params: serializedParams });
    return data;
  } catch (error) {
    handleApiError(error, 'Search dogs error');
  }
};

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
  try {
    if (!ids?.length) return [];
    // Ensure ids array is serializable
    const serializedIds = JSON.parse(JSON.stringify(ids));
    const { data } = await api.post('/dogs', serializedIds);
    return data;
  } catch (error) {
    handleApiError(error, 'Get dogs error');
  }
};

export const generateMatch = async (dogIds: string[]): Promise<string> => {
  try {
    if (!dogIds?.length) return '';
    // Ensure dogIds array is serializable
    const serializedIds = JSON.parse(JSON.stringify(dogIds));
    const { data } = await api.post('/dogs/match', serializedIds);
    return data.match;
  } catch (error) {
    handleApiError(error, 'Generate match error');
  }
};