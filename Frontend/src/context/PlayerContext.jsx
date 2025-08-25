import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { songAPI, albumAPI } from '../utils/api.js';
import { DEFAULT_VALUES } from '../utils/constants.js';

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
      const foundSong = songsData.find(item => item._id === id);
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

  const previous = async () => {
    if (!track || songsData.length === 0) return;
    
    const currentIndex = songsData.findIndex(item => item._id === track._id);
    if (currentIndex > 0) {
      await playWithId(songsData[currentIndex - 1]._id);
    } else if (repeat) {
      // If repeat is on, go to last song
      await playWithId(songsData[songsData.length - 1]._id);
    }
  };

  const next = async () => {
    if (!track || songsData.length === 0) return;
    
    const currentIndex = songsData.findIndex(item => item._id === track._id);
    if (currentIndex < songsData.length - 1) {
      await playWithId(songsData[currentIndex + 1]._id);
    } else if (repeat) {
      // If repeat is on, go to first song
      await playWithId(songsData[0]._id);
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

    // Actions
    play,
    pause,
    playWithId,
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
    loadSongs,
    loadAlbums,
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