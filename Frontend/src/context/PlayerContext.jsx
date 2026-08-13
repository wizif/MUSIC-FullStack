import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { songAPI, albumAPI, playlistAPI } from '../utils/api.js';
import { DEFAULT_VALUES } from '../utils/constants.js';
import { getPlayableSoundCloudUrl } from '../utils/soundcloudApi.js';
import { useAuth } from './AuthContext.jsx';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();

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

  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem('recently_played');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadPlaylists = async () => {
    try {
      const response = await playlistAPI.getAll();
      if (response.success && response.playlists) {
        setPlaylists(response.playlists);
      }
    } catch (err) {
      console.error('Failed to load playlists:', err);
    }
  };

  const createPlaylist = async (name, isPrivate = true) => {
    try {
      const response = await playlistAPI.create(name, isPrivate);
      if (response.success && response.playlist) {
        setPlaylists(prev => [...prev, response.playlist]);
        return response.playlist;
      }
    } catch (err) {
      console.error('Failed to create playlist:', err);
      throw err;
    }
  };

  const addTrackToPlaylist = async (playlistId, song) => {
    try {
      const response = await playlistAPI.addSong(playlistId, song);
      if (response.success && response.playlist) {
        setPlaylists(prev => prev.map(p => p._id === playlistId ? response.playlist : p));
        return true;
      }
    } catch (err) {
      console.error('Failed to add song to playlist:', err);
      throw err;
    }
  };

  const removeTrackFromPlaylist = async (playlistId, songId) => {
    try {
      const response = await playlistAPI.removeSong(playlistId, songId);
      if (response.success && response.playlist) {
        setPlaylists(prev => prev.map(p => p._id === playlistId ? response.playlist : p));
        return true;
      }
    } catch (err) {
      console.error('Failed to remove song from playlist:', err);
      throw err;
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      const response = await playlistAPI.delete(playlistId);
      if (response.success) {
        setPlaylists(prev => prev.filter(p => p._id !== playlistId));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete playlist:', err);
      throw err;
    }
  };

  const addToRecentlyPlayed = (song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(item => item._id !== song._id);
      const updated = [song, ...filtered].slice(0, 10);
      localStorage.setItem('recently_played', JSON.stringify(updated));
      return updated;
    });
  };

  // Load initial data (songs and albums)
  useEffect(() => {
    loadSongs();
    loadAlbums();
  }, []);

  // Sync user playlists when auth state changes
  useEffect(() => {
    if (user) {
      loadPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const toggleLikeTrack = async (song) => {
    try {
      if (!user) {
        alert("Please log in to like songs");
        return;
      }

      let likedPlaylist = playlists.find(p => p.name === 'Liked Songs');
      
      // If it doesn't exist, create it first
      if (!likedPlaylist) {
        likedPlaylist = await createPlaylist('Liked Songs', true);
      }

      const songExists = likedPlaylist.songs.some(s => s._id === song._id);
      if (songExists) {
        // Remove it
        await removeTrackFromPlaylist(likedPlaylist._id, song._id);
      } else {
        // Add it
        await addTrackToPlaylist(likedPlaylist._id, song);
      }
    } catch (err) {
      console.error("Failed to toggle like on track:", err);
      alert(err.message || "Failed to like track");
    }
  };

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
      
      // If not found, check current playlist
      if (!foundSong) {
        foundSong = currentPlaylist.find(item => item._id === id);
      }

      // If not found, check playlists
      if (!foundSong) {
        for (const p of playlists) {
          foundSong = p.songs?.find(item => item._id === id);
          if (foundSong) break;
        }
      }

      if (!foundSong) {
        throw new Error('Song not found');
      }

      await playTrack(foundSong);
    } catch (error) {
      console.error('❌ Error playing song by ID:', error);
      setError('Failed to play song');
    }
  };

  const playTrack = async (song, newPlaylist = null) => {
    try {
      console.log('🎵 Loading track:', song.name);
      
      if (newPlaylist) {
        setCurrentPlaylist(newPlaylist);
        console.log('🎵 Active playlist set with size:', newPlaylist.length);
      }

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
      
      // Add to recently played list
      addToRecentlyPlayed(song);

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
    if (!track) return;
    
    const playlist = currentPlaylist.length > 0 ? currentPlaylist : songsData;
    if (playlist.length === 0) return;
    
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      await playTrack(playlist[randomIndex]);
      return;
    }
    
    const currentIndex = playlist.findIndex(item => item._id === track._id);
    if (currentIndex > 0) {
      await playTrack(playlist[currentIndex - 1]);
    } else if (repeat) {
      await playTrack(playlist[playlist.length - 1]);
    }
  };

  const next = async () => {
    if (!track) return;
    
    const playlist = currentPlaylist.length > 0 ? currentPlaylist : songsData;
    if (playlist.length === 0) return;
    
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      await playTrack(playlist[randomIndex]);
      return;
    }
    
    const currentIndex = playlist.findIndex(item => item._id === track._id);
    if (currentIndex < playlist.length - 1) {
      await playTrack(playlist[currentIndex + 1]);
    } else if (repeat) {
      await playTrack(playlist[0]);
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
    playlists,
    recentlyPlayed,

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
    loadPlaylists,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    addToRecentlyPlayed,
    toggleLikeTrack,
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