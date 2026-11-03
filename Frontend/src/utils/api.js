import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants.js';

console.log('🌐 Backend API Base URL configured:', API_BASE_URL);

// Helper to get full URL for logging
const getFullUrl = (config) => {
  const base = (config?.baseURL || API_BASE_URL || '').replace(/\/+$/, '');
  const path = config?.url || '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${base}${path.startsWith('/') ? path : '/' + path}`;
};

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
    const fullUrl = getFullUrl(config);
    console.log(`📤 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error('❌ [API Request Config Error]:', error.message || error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const fullUrl = getFullUrl(response.config);
    console.log(`✅ [API Response ${response.status}] ${response.config.method?.toUpperCase()} ${fullUrl}`);
    return response;
  },
  (error) => {
    const fullUrl = getFullUrl(error.config);
    const method = error.config?.method?.toUpperCase() || 'REQUEST';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error(
        `❌ [API Timeout (30s)] ${method} ${fullUrl}\n` +
        `   ➤ The backend server took longer than 30 seconds to respond.\n` +
        `   ➤ If Render free tier: The service is asleep or cold-starting (takes 50-90s).\n` +
        `   ➤ If Localhost: The backend server is not running on port 4000.`
      );
    } else if (error.response) {
      const errorMsg = error.response.data?.message || JSON.stringify(error.response.data) || error.message;
      console.error(`❌ [API Error HTTP ${error.response.status}] ${method} ${fullUrl}:`, errorMsg);
    } else if (error.request) {
      console.error(
        `❌ [Network Connection Failed] ${method} ${fullUrl}\n` +
        `   ➤ Cannot reach backend server. Check if backend is running or blocked by CORS.`
      );
    } else {
      console.error(`❌ [API Error] ${method} ${fullUrl}:`, error.message);
    }

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
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch songs';
      throw new Error(detailedMessage);
    }
  },

  // Get current user's songs
  getMine: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SONGS.MINE);
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch your songs';
      throw new Error(detailedMessage);
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
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to add song';
      throw new Error(detailedMessage);
    }
  },

  // Remove song
  remove: async (songId) => {
    try {
      const response = await api.post(API_ENDPOINTS.SONGS.REMOVE, { id: songId });
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to remove song';
      throw new Error(detailedMessage);
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
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch albums';
      throw new Error(detailedMessage);
    }
  },

  // Get album with songs
  getWithSongs: async (albumId) => {
    try {
      const response = await api.get(API_ENDPOINTS.ALBUMS.GET_SONGS(albumId));
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch album songs';
      throw new Error(detailedMessage);
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
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to add album';
      throw new Error(detailedMessage);
    }
  },

  // Remove album
  remove: async (albumId) => {
    try {
      const response = await api.post(API_ENDPOINTS.ALBUMS.REMOVE, { id: albumId });
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to remove album';
      throw new Error(detailedMessage);
    }
  }
};

// Playlist API functions
export const playlistAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/api/playlist');
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch playlists';
      throw new Error(detailedMessage);
    }
  },
  create: async (name, isPrivate = true) => {
    try {
      const response = await api.post('/api/playlist/create', { name, isPrivate });
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to create playlist';
      throw new Error(detailedMessage);
    }
  },
  addSong: async (playlistId, song) => {
    try {
      const response = await api.post(`/api/playlist/${playlistId}/add`, { song });
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to add song to playlist';
      throw new Error(detailedMessage);
    }
  },
  removeSong: async (playlistId, songId) => {
    try {
      const response = await api.post(`/api/playlist/${playlistId}/remove`, { songId });
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to remove song from playlist';
      throw new Error(detailedMessage);
    }
  },
  getOne: async (playlistId) => {
    try {
      const response = await api.get(`/api/playlist/${playlistId}`);
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to fetch playlist';
      throw new Error(detailedMessage);
    }
  },
  delete: async (playlistId) => {
    try {
      const response = await api.delete(`/api/playlist/${playlistId}`);
      return response.data;
    } catch (error) {
      const detailedMessage = error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Connection timed out (backend not responding)' : error.message) || 'Failed to delete playlist';
      throw new Error(detailedMessage);
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
