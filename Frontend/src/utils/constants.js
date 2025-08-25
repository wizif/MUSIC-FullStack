// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  // Song endpoints
  SONGS: {
    LIST: '/api/song/list',
    ADD: '/api/song/add',
    REMOVE: '/api/song/remove'
  },
  
  // Album endpoints
  ALBUMS: {
    LIST: '/api/album/list', 
    ADD: '/api/album/add',
    REMOVE: '/api/album/remove',
    GET_SONGS: (albumId) => `/api/album/${albumId}/songs` // NEW: Get songs by album
  }
};

// App Routes
export const ROUTES = {
  HOME: '/',
  ALBUM: '/album/:id',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ADD_SONG: '/admin/add-song',
  ADMIN_ADD_ALBUM: '/admin/add-album',
  ADMIN_LIST_SONGS: '/admin/list-songs',
  ADMIN_LIST_ALBUMS: '/admin/list-albums'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Admin Emails - Users with these emails get admin access
export const ADMIN_EMAILS = [
  'admin@spotify.com',
  'admin@music.com',
  'superadmin@spotify.com'
];

// File Upload Constraints
export const UPLOAD_CONSTRAINTS = {
  AUDIO: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg']
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};

// Default Values
export const DEFAULT_VALUES = {
  VOLUME: 50,
  USER: {
    id: 1,
    name: 'Demo User',
    email: 'demo@spotify.com'
  }
};

// Colors
export const COLORS = {
  SPOTIFY_GREEN: '#1DB954',
  SPOTIFY_BLACK: '#191414',
  SPOTIFY_GRAY: '#121212',
  SPOTIFY_LIGHT_GRAY: '#282828'
};