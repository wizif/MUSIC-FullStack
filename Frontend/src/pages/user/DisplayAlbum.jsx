import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Heart, MoreHorizontal, Clock, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import SongItem from '../../components/shared/SongItem.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const DisplayAlbum = () => {
  const { id } = useParams();
  const { 
    albumsData, 
    songsData, 
    playWithId, 
    track, 
    playStatus, 
    albumsLoading,
    songsLoading 
  } = usePlayer();
  
  const [albumSongs, setAlbumSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find the current album
  const album = albumsData.find(item => item._id === id);

  // Filter songs that belong to this album
  useEffect(() => {
    if (album && songsData.length > 0) {
      const filteredSongs = songsData.filter(song => 
        song.album === album.name || song.album === album._id
      );
      setAlbumSongs(filteredSongs);
      setLoading(false);
      console.log(`🎵 Found ${filteredSongs.length} songs for album: ${album.name}`);
    } else if (!albumsLoading && !songsLoading) {
      setLoading(false);
    }
  }, [album, songsData, albumsLoading, songsLoading]);

  const playAlbum = () => {
    if (albumSongs.length > 0) {
      playWithId(albumSongs[0]._id);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    return duration;
  };

  const isCurrentAlbumPlaying = () => {
    if (!track || albumSongs.length === 0) return false;
    return albumSongs.some(song => song._id === track._id);
  };

  // Loading state
  if (loading || albumsLoading || songsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading album..." />
      </div>
    );
  }

  // Album not found
  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Album Not Found</h2>
        <p className="text-gray-400">The album you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Album Header */}
      <div className="flex items-end space-x-6 mb-8">
        <img 
          className="w-60 h-60 shadow-2xl rounded-lg object-cover" 
          src={album.image} 
          alt={album.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/240x240/1f1f1f/ffffff?text=No+Image';
          }}
        />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white uppercase tracking-wider">Album</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-2 mb-4 leading-tight">
            {album.name}
          </h1>
          <p className="text-gray-300 text-lg mb-4 max-w-2xl">
            {album.desc}
          </p>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="font-medium text-white">MusicOn</span>
            <span>•</span>
            <span>{albumSongs.length} song{albumSongs.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-8">
        <button
          onClick={playAlbum}
          disabled={albumSongs.length === 0}
          className="bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black rounded-full p-4 transition-all hover:scale-105 shadow-lg"
        >
          {isCurrentAlbumPlaying() && playStatus ? 
            <Pause className="w-6 h-6 fill-current" /> : 
            <Play className="w-6 h-6 fill-current ml-1" />
          }
        </button>
        
        <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
          <Heart className="w-8 h-8" />
        </button>
        
        <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
          <MoreHorizontal className="w-8 h-8" />
        </button>
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-medium uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-4">Album</div>
          <div className="col-span-1 flex justify-end">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Songs */}
        {albumSongs.length > 0 ? (
          albumSongs.map((song, index) => (
            <div
              key={song._id}
              onClick={() => playWithId(song._id)}
              className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-[#ffffff1a] cursor-pointer transition-all duration-200 group ${
                track?._id === song._id ? 'bg-[#ffffff1a]' : ''
              }`}
            >
              {/* Index/Play Icon */}
              <div className="col-span-1 flex items-center">
                {track?._id === song._id && playStatus ? (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-400 group-hover:hidden text-sm">
                      {index + 1}
                    </span>
                    <Play className="w-4 h-4 text-white hidden group-hover:block fill-current" />
                  </>
                )}
              </div>

              {/* Song Info */}
              <div className="col-span-6 flex items-center min-w-0">
                <img 
                  src={song.image} 
                  alt={song.name}
                  className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40x40/1f1f1f/ffffff?text=♪';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-medium truncate ${
                    track?._id === song._id ? 'text-green-500' : 'text-white'
                  }`}>
                    {song.name}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {song.desc}
                  </p>
                </div>
              </div>

              {/* Album Name */}
              <div className="col-span-4 flex items-center">
                <p className="text-gray-400 text-sm truncate hover:text-white cursor-pointer">
                  {album.name}
                </p>
              </div>

              {/* Duration */}
              <div className="col-span-1 flex items-center justify-end">
                <span className="text-gray-400 text-sm">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No songs found</h3>
              <p>This album doesn't have any songs yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Album Stats */}
      {albumSongs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default DisplayAlbum;