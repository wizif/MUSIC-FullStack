import React, { useState } from 'react';
import { Play, Pause, Trash2, Search, Filter, Music, Clock } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { songAPI } from '../../utils/api.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const ListSong = () => {
  const { songsData, songsLoading, playTrack, playStatus, track, loadSongs, pause, play } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter songs based on search term and selected album
  const filteredSongs = songsData.filter(song => {
    const matchesSearch = song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlbum = selectedAlbum === '' || song.album === selectedAlbum;
    return matchesSearch && matchesAlbum;
  });

  // Get unique albums for filter dropdown
  const uniqueAlbums = [...new Set(songsData.map(song => song.album))].filter(Boolean);

  const handleDelete = async (songId, songName) => {
    if (!confirm(`Are you sure you want to delete "${songName}"?`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await songAPI.remove(songId);
      
      if (response.success) {
        await loadSongs(); // Reload the songs list
        console.log('Song deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete song');
      }
    } catch (error) {
      setError(`Failed to delete song: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song) => {
    if (track && track._id === song._id) {
      if (playStatus) {
        pause();
      } else {
        play();
      }
    } else {
      playTrack(song, songsData);
    }
  };

  const isCurrentSong = (songId) => {
    return track && track._id === songId;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (songsLoading) {
    return <LoadingSpinner text="Loading songs..." size="large" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All Songs</h1>
        <p className="text-gray-400">Manage your music library</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Album Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[150px]"
            >
              <option value="">All Albums</option>
              {uniqueAlbums.map((album) => (
                <option key={album} value={album}>
                  {album}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="text-gray-400 text-sm">
          Showing {filteredSongs.length} of {songsData.length} songs
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length > 0 ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_200px_150px_100px_60px] gap-4 px-4 py-3 border-b border-gray-700 text-gray-400 text-sm font-medium">
            <div></div>
            <div>SONG</div>
            <div className="hidden md:block">ALBUM</div>
            <div className="hidden sm:block">DURATION</div>
            <div className="hidden lg:block">SIZE</div>
            <div></div>
          </div>

          {/* Songs */}
          <div className="divide-y divide-gray-700">
            {filteredSongs.map((song, index) => (
              <div
                key={song._id}
                className="grid grid-cols-[60px_1fr_200px_150px_100px_60px] gap-4 px-4 py-3 hover:bg-gray-700 transition-colors group"
              >
                {/* Play Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => handlePlay(song)}
                    className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all hover:scale-105"
                    disabled={loading}
                  >
                    {isCurrentSong(song._id) && playStatus ? (
                      <Pause className="w-4 h-4 text-black" />
                    ) : (
                      <Play className="w-4 h-4 text-black fill-black" />
                    )}
                  </button>
                </div>

                {/* Song Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48/1f1f1f/ffffff?text=♪';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium truncate ${
                      isCurrentSong(song._id) ? 'text-green-400' : 'text-white'
                    }`}>
                      {song.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">{song.desc}</p>
                  </div>
                </div>

                {/* Album */}
                <div className="flex items-center hidden md:block">
                  <span className="text-gray-300 truncate">{song.album}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center hidden sm:block">
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    {song.duration || '0:00'}
                  </div>
                </div>

                {/* File Size */}
                <div className="flex items-center hidden lg:block">
                  <span className="text-gray-400 text-sm">
                    {formatFileSize(song.fileSize)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleDelete(song._id, song.name)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors hover:bg-red-900/20 rounded"
                    disabled={loading}
                    title="Delete song"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          {searchTerm || selectedAlbum ? (
            <>
              <h3 className="text-white text-lg font-medium mb-2">No songs found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedAlbum('');
                }}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <h3 className="text-white text-lg font-medium mb-2">No songs uploaded</h3>
              <p className="text-gray-400">
                Start building your music library by adding your first song
              </p>
            </>
          )}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingSpinner text="Processing..." />
        </div>
      )}
    </div>
  );
};

export default ListSong;