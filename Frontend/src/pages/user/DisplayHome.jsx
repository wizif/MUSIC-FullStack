import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Navbar from '../../components/user/Navbar.jsx';
import AlbumItem from '../../components/shared/AlbumItem.jsx';
import SongItem from '../../components/shared/SongItem.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const DisplayHome = () => {
  const { songsData, albumsData, songsLoading, albumsLoading, playWithId, error } = usePlayer();
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (e, songId) => {
    // Prevent infinite loop by tracking which images have already failed
    if (!imageErrors.has(songId)) {
      setImageErrors(prev => new Set([...prev, songId]));
      // Use a data URL instead of external placeholder service
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMWYxZjFmIi8+CjxwYXRoIGQ9Ik0yNCAzNkMyNy4zMTM3IDM2IDMwIDMzLjMxMzcgMzAgMzBDMzAgMjYuNjg2MyAyNy4zMTM3IDI0IDI0IDI0QzIwLjY4NjMgMjQgMTggMjYuNjg2MyAxOCAzMEMxOCAzMy4zMTM3IDIwLjY4NjMgMzYgMjQgMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMTJDMjUuMTA0NiAxMiAyNiAxMi44OTU0IDI2IDE0VjIyQzI2IDIzLjEwNDYgMjUuMTA0NiAyNCAyNCAyNEMyMi44OTU0IDI0IDIyIDIzLjEwNDYgMjIgMjJWMTRDMjIgMTIuODk1NCAyMi44OTU0IDEyIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    }
  };

  if (error) {
    return (
      <div className="w-full h-full">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">⚠️ Error loading content</p>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Navbar />
      
      <div className="px-6 pb-6 w-full">
        {/* Featured Charts */}
        <div className="mb-8 w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Featured Charts</h1>
          {albumsLoading ? (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <AlbumItem key={i} album={null} />
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide w-full">
              {albumsData.length > 0 ? (
                albumsData.map((album) => (
                  <AlbumItem 
                    key={album._id} 
                    album={album}
                  />
                ))
              ) : (
                <div className="text-gray-400 py-8">
                  No albums available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today's biggest hits */}
        <div className="mb-8 w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Today's biggest hits</h1>
          {songsLoading ? (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <SongItem key={i} song={null} />
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide w-full">
              {songsData.length > 0 ? (
                songsData.map((song) => (
                  <SongItem 
                    key={song._id} 
                    song={song}
                  />
                ))
              ) : (
                <div className="text-gray-400 py-8">
                  No songs available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recently played */}
        <div className="mb-8 w-full">
          <h1 className="text-2xl font-bold text-white mb-4">Recently played</h1>
          {songsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center bg-[#ffffff1a] rounded-lg p-2 animate-pulse">
                  <div className="w-12 h-12 bg-gray-700 rounded mr-4"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
              {songsData.length > 0 ? (
                songsData.slice(0, 10).map((song) => (
                  <div 
                    key={song._id}
                    onClick={() => playWithId(song._id)}
                    className="flex items-center bg-[#ffffff1a] hover:bg-[#ffffff2a] rounded-lg p-2 cursor-pointer transition-colors group w-full"
                  >
                    <img 
                      src={song.image} 
                      alt={song.name}
                      className="w-12 h-12 rounded object-cover mr-4 flex-shrink-0" 
                      onError={(e) => handleImageError(e, song._id)}
                    />
                    <span className="text-white font-medium truncate flex-1 min-w-0" title={song.name}>
                      {song.name}
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-400 py-8 text-center w-full">
                  No songs available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Made for you */}
        {songsData.length > 0 && (
          <div className="mb-8 w-full">
            <h1 className="text-2xl font-bold text-white mb-4">Made for you</h1>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide w-full">
              {songsData.slice(0, 10).map((song) => (
                <SongItem 
                  key={`made-for-you-${song._id}`} 
                  song={song}
                />
              ))}
            </div>
          </div>
        )}

        {/* Jump back in */}
        {albumsData.length > 0 && (
          <div className="mb-8 w-full">
            <h1 className="text-2xl font-bold text-white mb-4">Jump back in</h1>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide w-full">
              {albumsData.slice(0, 8).map((album) => (
                <AlbumItem 
                  key={`jump-back-${album._id}`} 
                  album={album}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayHome;