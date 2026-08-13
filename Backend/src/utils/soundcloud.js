// SoundCloud Scraper & API Helper

let cachedClientId = '';
let cacheExpiry = 0;

/**
 * Fetch helper with built-in AbortController timeout.
 */
const fetchWithTimeout = async (url, options = {}, timeoutMs = 3500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
};

/**
 * Programmatically fetch a working SoundCloud client_id from their client bundles.
 */
export const getSoundCloudClientId = async () => {
  const now = Date.now();
  if (cachedClientId && now < cacheExpiry) {
    return cachedClientId;
  }

  try {
    console.log('🔍 Scraping SoundCloud for a fresh client_id...');
    const response = await fetchWithTimeout('https://soundcloud.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();

    const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
    let match;
    const scriptUrls = [];
    while ((match = scriptRegex.exec(html)) !== null) {
      if (match[1] && match[1].includes('sndcdn.com')) {
        scriptUrls.push(match[1]);
      }
    }

    scriptUrls.reverse();

    const clientIdRegex = /,client_id:"([a-zA-Z0-9]{32})"/;
    const fallbackRegex = /client_id[:=]["']([a-zA-Z0-9]{32})["']/i;

    for (const url of scriptUrls) {
      try {
        const scriptRes = await fetchWithTimeout(url);
        const scriptText = await scriptRes.text();
        const matchId = scriptText.match(clientIdRegex) || scriptText.match(fallbackRegex);
        
        if (matchId && matchId[1]) {
          cachedClientId = matchId[1];
          cacheExpiry = now + 60 * 60 * 1000; // cache for 1 hour
          console.log('✅ Found active client_id:', cachedClientId);
          return cachedClientId;
        }
      } catch (err) {
        console.warn(`⚠️ Failed to parse script URL ${url}:`, err.message);
      }
    }
    throw new Error('Could not find client_id in SoundCloud scripts');
  } catch (error) {
    console.error('❌ Error resolving SoundCloud client_id:', error.message);
    return cachedClientId || 'pJ6Fj6roW2KRzWAOwGj6kkQ8VRBJjyBD';
  }
};

/**
 * Searches SoundCloud for tracks and normalizes them.
 */
export const searchSoundCloudTracks = async (query, limit = 8) => {
  try {
    const clientId = await getSoundCloudClientId();
    const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${clientId}&limit=${limit}`;
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`SoundCloud API returned status ${response.status}`);
    const data = await response.json();

    const normalized = [];
    for (const track of (data.collection || [])) {
      if (track.media && track.media.transcodings) {
        const norm = normalizeSoundCloudTrack(track);
        if (norm) {
          normalized.push(norm);
        }
      }
    }
    return normalized;
  } catch (error) {
    console.error('❌ SoundCloud search failed:', error.message || error);
    return [];
  }
};

/**
 * Fetches popular/discovery tracks from SoundCloud using a rotating list of genre searches.
 */
export const getSoundCloudDiscovery = async (limit = 10) => {
  try {
    const genres = ['lofi', 'electronic', 'indie', 'hip hop', 'synthwave', 'chill', 'pop', 'ambient'];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    console.log(`🎵 SoundCloud Discovery Genre rotating select: "${randomGenre}"`);
    return await searchSoundCloudTracks(randomGenre, limit);
  } catch (error) {
    console.error('❌ SoundCloud discovery failed:', error.message || error);
    return [];
  }
};

/**
 * Resolves a SoundCloud transcoding URL to a playable progressive MP3 URL.
 */
export const resolveStreamUrl = async (transcodingUrl) => {
  try {
    const clientId = await getSoundCloudClientId();
    const url = `${transcodingUrl}?client_id=${clientId}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`Transcoding resolve status ${response.status}`);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('❌ Failed to resolve stream URL:', error.message || error);
    return null;
  }
};

/**
 * Normalizes a SoundCloud track to match the application's internal structure.
 */
const normalizeSoundCloudTrack = (track) => {
  const progressiveTranscoding = track.media.transcodings.find(
    t => t.format && t.format.protocol === 'progressive'
  );
  
  if (!progressiveTranscoding) return null;

  const durationSec = Math.floor((track.duration || 0) / 1000);
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;

  return {
    _id: `soundcloud-${track.id}`,
    name: track.title,
    desc: track.user ? track.user.username : 'Unknown Artist',
    album: 'SoundCloud Single',
    image: track.artwork_url ? track.artwork_url.replace('-large.', '-t300x300.') : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiLz48L3N2Zz4=',
    duration: `${minutes}:${String(seconds).padStart(2, '0')}`,
    external: true,
    externalUrl: track.permalink_url,
    genre: track.genre || 'Music',
    transcodingUrl: progressiveTranscoding.url
  };
};
