import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants.js';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Song API functions
export const songAPI = {
  // Get all songs
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SONGS.LIST);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch songs');
    }
  },

  // Get current user's songs
  getMine: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SONGS.MINE);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your songs');
    }
  },

  // Add new song
  add: async (songData) => {
    try {
      const formData = new FormData();
      formData.append('name', songData.name);
      formData.append('desc', songData.desc || songData.artist);
      formData.append('album', songData.album);
      
      if (songData.audioFile) {
        formData.append('audio', songData.audioFile);
      }
      if (songData.imageFile) {
        formData.append('image', songData.imageFile);
      }

      const response = await api.post(API_ENDPOINTS.SONGS.ADD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add song');
    }
  },

  // Remove song
  remove: async (songId) => {
    try {
      const response = await api.post(API_ENDPOINTS.SONGS.REMOVE, { id: songId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove song');
    }
  }
};

// Album API functions
export const albumAPI = {
  // Get all albums
  getAll: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ALBUMS.LIST);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch albums');
    }
  },

  // Get album with songs
  getWithSongs: async (albumId) => {
    try {
      const response = await api.get(API_ENDPOINTS.ALBUMS.GET_SONGS(albumId));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch album songs');
    }
  },

  // Add new album
  add: async (albumData) => {
    try {
      const formData = new FormData();
      formData.append('name', albumData.name);
      formData.append('desc', albumData.desc);
      formData.append('bgColour', albumData.bgColour);
      
      if (albumData.imageFile) {
        formData.append('image', albumData.imageFile);
      }

      const response = await api.post(API_ENDPOINTS.ALBUMS.ADD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add album');
    }
  },

  // Remove album
  remove: async (albumId) => {
    try {
      const response = await api.post(API_ENDPOINTS.ALBUMS.REMOVE, { id: albumId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove album');
    }
  }
};

// Utility functions
export const validateFile = (file, type = 'audio') => {
  const constraints = type === 'audio' 
    ? { maxSize: 10 * 1024 * 1024, types: ['audio/mpeg', 'audio/wav', 'audio/flac'] }
    : { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] };

  if (file.size > constraints.maxSize) {
    throw new Error(`File size must be less than ${constraints.maxSize / (1024 * 1024)}MB`);
  }

  if (!constraints.types.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${constraints.types.join(', ')}`);
  }

  return true;
};

export default api;