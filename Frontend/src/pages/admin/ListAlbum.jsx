import React, { useState } from 'react';
import { Play, Trash2, Search, Album, Edit } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { albumAPI } from '../../utils/api.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const ListAlbum = () => {
  const { albumsData, songsData, albumsLoading, loadAlbums } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter albums based on search term
  const filteredAlbums = albumsData.filter(album =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get song count for each album
  const getAlbumSongCount = (albumName) => {
    return songsData.filter(song => song.album === albumName).length;
  };

  const handleDelete = async (albumId, albumName) => {
    const songCount = getAlbumSongCount(albumName);
    
    let confirmMessage = `Are you sure you want to delete "${albumName}"?`;
    if (songCount > 0) {
      confirmMessage += `\n\nThis album contains ${songCount} song(s). The songs will not be deleted, but they will lose their album association.`;
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await albumAPI.remove(albumId);
      
      if (response.success) {
        await loadAlbums(); // Reload the albums list
        console.log('Album deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete album');
      }
    } catch (error) {
      setError(`Failed to delete album: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (albumsLoading) {
    return <LoadingSpinner text="Loading albums..." size="large" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All Albums</h1>
        <p className="text-gray-400">Manage your album collection</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <span className="text-red-400">{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="text-gray-400 text-sm ml-4">
          {filteredAlbums.length} of {albumsData.length} albums
        </div>
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => {
            const songCount = getAlbumSongCount(album.name);
            
            return (
              <div
                key={album._id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group"
              >
                {/* Album Art */}
                <div className="relative mb-4">
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full aspect-square rounded-lg object-cover group-hover:opacity-75 transition-opacity"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/1f1f1f/ffffff?text=No+Image';
                    }}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      className="p-2 bg-green-500 rounded-full hover:bg-green-400 transition-colors"
                      title="Play album"
                      disabled={songCount === 0}
                    >
                      <Play className="w-4 h-4 text-black fill-black" />
                    </button>
                    <button
                      onClick={() => handleDelete(album._id, album.name)}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                      title="Delete album"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Album Info */}
                <div className="space-y-2">
                  <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors" title={album.name}>
                    {album.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2" title={album.desc}>
                    {album.desc}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{songCount} song{songCount !== 1 ? 's' : ''}</span>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: album.bgColour }}
                      title={`Color: ${album.bgColour}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Album className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          {searchTerm ? (
            <>
              <h3 className="text-white text-lg font-medium mb-2">No albums found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-green-500 hover:text-green-400 font-medium"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-white text-lg font-medium mb-2">No albums created</h3>
              <p className="text-gray-400">
                Create your first album to organize your music
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

export default ListAlbum;