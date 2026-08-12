import axios from 'axios';
import { API_BASE_URL } from './constants.js';

// We can construct requests using the same base URL
const scApi = axios.create({
  baseURL: `${API_BASE_URL}/api/soundcloud`,
  timeout: 10000
});

// Request interceptor to add authorization token if available
scApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Searches SoundCloud via Backend scraper/proxy.
 */
export const searchSoundCloud = async (query, limit = 8) => {
  try {
    const response = await scApi.get('/search', {
      params: { q: query, limit }
    });
    if (response.data && response.data.success) {
      return response.data.tracks || [];
    }
    return [];
  } catch (error) {
    console.error('SoundCloud search request failed:', error);
    return [];
  }
};

/**
 * Fetches SoundCloud discovery charts via Backend scraper/proxy.
 */
export const fetchSoundCloudDiscovery = async (limit = 12) => {
  try {
    const response = await scApi.get('/discovery', {
      params: { limit }
    });
    if (response.data && response.data.success) {
      return response.data.tracks || [];
    }
    return [];
  } catch (error) {
    console.error('SoundCloud discovery request failed:', error);
    return [];
  }
};

/**
 * Resolves a SoundCloud transcoding URL to a direct streamable MP3 URL.
 */
export const getPlayableSoundCloudUrl = async (transcodingUrl) => {
  try {
    const response = await scApi.get('/stream', {
      params: { url: transcodingUrl }
    });
    if (response.data && response.data.success) {
      return response.data.playableUrl;
    }
    return null;
  } catch (error) {
    console.error('SoundCloud stream URL resolution failed:', error);
    return null;
  }
};
