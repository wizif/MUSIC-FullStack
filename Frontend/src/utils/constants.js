// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Default values
export const DEFAULT_VALUES = {
  USER: null,
  VOLUME: 50
};

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API endpoints
export const API_ENDPOINTS = {
  SONGS: {
    LIST: '/api/song/list',
    ADD: '/api/song/add',
    REMOVE: '/api/song/remove',
    MINE: '/api/song/mine'
  },
  ALBUMS: {
    LIST: '/api/album/list',
    ADD: '/api/album/add',
    REMOVE: '/api/album/remove',
    GET_SONGS: (albumId) => `/api/album/${albumId}/songs`
  }
};

// File size limits (in bytes)
export const FILE_LIMITS = {
  AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
  IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
};

// Supported file types
export const SUPPORTED_FORMATS = {
  AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'spotify_user',
  USER_ROLE: 'spotify_user_role',
  VOLUME: 'spotify_volume',
  THEME: 'spotify_theme'
};



// Player states
export const PLAYER_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  LOADING: 'loading',
  ERROR: 'error'
};

// Color presets for albums
export const COLOR_PRESETS = [
  '#1DB954', // Spotify Green
  '#1E3A8A', // Blue
  '#7C3AED', // Purple
  '#DC2626', // Red
  '#EA580C', // Orange
  '#059669', // Emerald
  '#7C2D12', // Brown
  '#374151', // Gray
  '#BE185D', // Pink
  '#0891B2', // Cyan
];

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ALBUM: '/album/:id',
  ADMIN: {
    DASHBOARD: '/admin',
    ADD_SONG: '/admin/add-song',
    ADD_ALBUM: '/admin/add-album',
    LIST_SONGS: '/admin/list-songs',
    LIST_ALBUMS: '/admin/list-albums'
  }
};