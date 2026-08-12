import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { songAPI, albumAPI } from '../utils/api.js';
import { DEFAULT_VALUES } from '../utils/constants.js';
import { getPlayableSoundCloudUrl } from '../utils/soundcloudApi.js';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // Audio refs
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);
  const volumeBg = useRef(null);
  const volumeBar = useRef(null);

  // State
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VALUES.VOLUME);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Loading states
  const [songsLoading, setSongsLoading] = useState(true);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Playlist state
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Album songs cache
  const [albumSongsCache, setAlbumSongsCache] = useState({});

  // Load initial data
  useEffect(() => {
    loadSongs();
    loadAlbums();
  }, []);

  // Load songs from API
  const loadSongs = async () => {
    try {
      setSongsLoading(true);
      setError(null);
      const response = await songAPI.getAll();
      
      if (response.success && response.songs) {
        setSongsData(response.songs);
        console.log('🎵 Songs loaded:', response.songs.length);
      } else {
        throw new Error(response.message || 'Failed to load songs');
      }
    } catch (error) {
      console.error('❌ Error loading songs:', error);
      setError(error.message);
      // Use fallback data if API fails
      setSongsData([]);
    } finally {
      setSongsLoading(false);
    }
  };

  // Load albums from API
  const loadAlbums = async () => {
    try {
      setAlbumsLoading(true);
      setError(null);
      const response = await albumAPI.getAll();
      
      if (response.success && response.albums) {
        setAlbumsData(response.albums);
        console.log('💿 Albums loaded:', response.albums.length);
      } else {
        throw new Error(response.message || 'Failed to load albums');
      }
    } catch (error) {
      console.error('❌ Error loading albums:', error);
      setError(error.message);
      // Use fallback data if API fails
      setAlbumsData([]);
    } finally {
      setAlbumsLoading(false);
    }
  };

  // Load songs for specific album
  const loadAlbumSongs = async (albumId) => {
    try {
      // Check cache first
      if (albumSongsCache[albumId]) {
        console.log('🎵 Using cached songs for album:', albumId);
        return albumSongsCache[albumId];
      }

      console.log('🎵 Loading songs for album:', albumId);
      const response = await albumAPI.getWithSongs(albumId);
      
      if (response.success && response.songs) {
        // Cache the songs
        setAlbumSongsCache(prev => ({
          ...prev,
          [albumId]: response.songs
        }));
        
        console.log('✅ Album songs loaded:', response.songs.length);
        return response.songs;
      } else {
        throw new Error(response.message || 'Failed to load album songs');
      }
    } catch (error) {
      console.error('❌ Error loading album songs:', error);
      // Fallback: filter from all songs
      const album = albumsData.find(a => a._id === albumId);
      if (album) {
        const filteredSongs = songsData.filter(song => 
          song.album === album.name || song.album === albumId
        );
        return filteredSongs;
      }
      return [];
    }
  };

  // Audio control functions
  const play = async () => {
    if (audioRef.current && track) {
      try {
        await audioRef.current.play();
        setPlayStatus(true);
        console.log('▶️ Playing:', track.name);
      } catch (error) {
        console.error('❌ Play error:', error);
        setError('Failed to play track');
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
      console.log('⏸️ Paused');
    }
  };

  const playWithId = async (id) => {
    try {
      let foundSong = songsData.find(item => item._id === id);
      
      // If not found in main songs, check album cache
      if (!foundSong) {
        for (const albumId in albumSongsCache) {
          foundSong = albumSongsCache[albumId].find(item => item._id === id);
          if (foundSong) break;
        }
      }
      
      if (!foundSong) {
        throw new Error('Song not found');
      }

      console.log('🎵 Loading song:', foundSong.name);
      setTrack(foundSong);
      
      if (audioRef.current) {
        audioRef.current.src = foundSong.file;
        await audioRef.current.play();
        setPlayStatus(true);
      }
    } catch (error) {
      console.error('❌ Error playing song:', error);
      setError('Failed to play song');
    }
  };

  const playTrack = async (song) => {
    try {
      console.log('🎵 Loading track:', song.name);
      
      let playableUrl = song.file || song.previewUrl;
      if (song.external && song.transcodingUrl) {
        // Resolve the temporary MP3 stream URL from our Backend API
        const resolvedUrl = await getPlayableSoundCloudUrl(song.transcodingUrl);
        if (resolvedUrl) {
          playableUrl = resolvedUrl;
        } else {
          throw new Error('Failed to resolve SoundCloud playback URL');
        }
      }

      // Create a temporary object for playing state to set the resolved URL as the source
      const trackToPlay = {
        ...song,
        file: playableUrl
      };
      
      setTrack(trackToPlay);
      
      if (audioRef.current) {
        audioRef.current.src = playableUrl;
        await audioRef.current.play();
        setPlayStatus(true);
      }
    } catch (error) {
      console.error('❌ Error playing track:', error);
      setError(error.message || 'Failed to play track');
    }
  };

  const previous = async () => {
    if (!track || currentPlaylist.length === 0) {
      // Use all songs if no specific playlist
      const playlist = currentPlaylist.length > 0 ? currentPlaylist : songsData;
      if (playlist.length === 0) return;
      
      const currentIndex = playlist.findIndex(item => item._id === track._id);
      if (currentIndex > 0) {
        await playWithId(playlist[currentIndex - 1]._id);
      } else if (repeat) {
        await playWithId(playlist[playlist.length - 1]._id);
      }
    }
  };

  const next = async () => {
    if (!track) return;
    
    const playlist = currentPlaylist.length > 0 ? currentPlaylist : songsData;
    if (playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(item => item._id === track._id);
    if (currentIndex < playlist.length - 1) {
      await playWithId(playlist[currentIndex + 1]._id);
    } else if (repeat) {
      await playWithId(playlist[0]._id);
    }
  };

  const seekSong = (e) => {
    if (audioRef.current && seekBg.current) {
      const newTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const setVolumeLevel = (e) => {
    if (audioRef.current && volumeBg.current) {
      const newVolume = (e.nativeEvent.offsetX / volumeBg.current.offsetWidth) * 100;
      setVolume(newVolume);
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    console.log('🔀 Shuffle:', !shuffle ? 'ON' : 'OFF');
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
    console.log('🔁 Repeat:', !repeat ? 'ON' : 'OFF');
  };

  // Set current playlist (for album playback)
  const setAlbumPlaylist = (songs) => {
    setCurrentPlaylist(songs);
    console.log('🎵 Album playlist set:', songs.length, 'songs');
  };

  // Handle audio time updates
  useEffect(() => {
    if (!audioRef.current) return;

    const updateTime = () => {
      if (audioRef.current && seekBar.current && !isNaN(audioRef.current.duration)) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        seekBar.current.style.width = Math.floor(progress) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    const handleEnded = () => {
      if (repeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        next();
      }
    };

    const handleError = (e) => {
      console.error('❌ Audio error:', e);
      setError('Audio playback error');
      setPlayStatus(false);
    };

    audioRef.current.ontimeupdate = updateTime;
    audioRef.current.onended = handleEnded;
    audioRef.current.onerror = handleError;

    return () => {
      if (audioRef.current) {
        audioRef.current.ontimeupdate = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }
    };
  }, [track, repeat]);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  // Context value
  const contextValue = {
    // Refs
    audioRef,
    seekBar,
    seekBg,
    volumeBar,
    volumeBg,

    // State
    track,
    playStatus,
    time,
    volume,
    songsData,
    albumsData,
    songsLoading,
    albumsLoading,
    error,
    shuffle,
    repeat,
    currentPlaylist,
    albumSongsCache,

    // Actions
    play,
    pause,
    playWithId,
    playTrack,
    previous,
    next,
    seekSong,
    setVolumeLevel,
    toggleShuffle,
    toggleRepeat,
    setTrack,
    setPlayStatus,
    setTime,
    setVolume,
    setSongsData,
    setAlbumsData,
    setCurrentPlaylist,
    setAlbumPlaylist,
    loadSongs,
    loadAlbums,
    loadAlbumSongs,
    setError
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;