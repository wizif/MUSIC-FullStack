import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Navbar from '../../components/user/Navbar.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const DisplayAlbum = () => {
  const { id } = useParams();
  const { playWithId, albumsData, songsData, albumsLoading, songsLoading } = usePlayer();

  const albumData = albumsData.find(item => item._id === id);
  const albumSongs = songsData.filter((item) => item.album === albumData?.name);

  if (albumsLoading || songsLoading) {
    return (
      <div>
        <Navbar />
        <LoadingSpinner text="Loading album..." />
      </div>
    );
  }

  if (!albumData) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-2">Album not found</p>
            <p className="text-gray-400">The album you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const playAlbum = () => {
    if (albumSongs.length > 0) {
      playWithId(albumSongs[0]._id);
    }
  };

  const getTotalDuration = () => {
    if (albumSongs.length === 0) return '0 min';
    
    const totalSeconds = albumSongs.reduce((total, song) => {
      if (!song.duration) return total;
      const [minutes, seconds] = song.duration.split(':').map(Number);
      return total + (minutes * 60) + seconds;
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  return (
    <div>
      <Navbar />
      
      {/* Album Header */}
      <div className="flex gap-6 mb-6 flex-col md:flex-row">
        <img 
          className="w-60 h-60 rounded-lg object-cover shadow-2xl mx-auto md:mx-0" 
          src={albumData.image} 
          alt={albumData.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/240x240/1f1f1f/ffffff?text=No+Image';
          }}
        />
        <div className="flex flex-col justify-end text-center md:text-left">
          <p className="text-sm font-medium text-white mb-2 uppercase tracking-wider">ALBUM</p>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {albumData.name}
          </h1>
          <div className="flex items-center text-gray-300 justify-center md:justify-start flex-wrap">
            <span className="font-medium text-white">{albumData.desc}</span>
            <span className="mx-2 hidden md:inline">•</span>
            <span className="mx-2 md:mx-0">{new Date().getFullYear()}</span>
            <span className="mx-2">•</span>
            <span>{albumSongs.length} songs</span>
            {albumSongs.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{getTotalDuration()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Album Controls */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-6 mb-6">
          <button 
            onClick={playAlbum}
            className="bg-green-500 hover:bg-green-400 rounded-full p-4 transition-all duration-200 hover:scale-105 shadow-lg"
            disabled={albumSongs.length === 0}
          >
            <Play className="w-6 h-6 text-black fill-black" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
            <Heart className="w-8 h-8" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
            <MoreHorizontal className="w-8 h-8" />
          </button>
        </div>

        {/* Songs List Header */}
        <div className="grid grid-cols-[16px_1fr_1fr_1fr_16px] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-600 mb-2">
          <div>#</div>
          <div>TITLE</div>
          <div className="hidden md:block">ALBUM</div>
          <div className="hidden sm:block">DATE ADDED</div>
          <div className="flex justify-center"><Clock className="w-4 h-4" /></div>
        </div>

        {/* Songs List */}
        {albumSongs.length > 0 ? (
          <div className="space-y-1">
            {albumSongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => playWithId(song._id)}
                className="grid grid-cols-[16px_1fr_1fr_1fr_16px] gap-4 px-4 py-2 text-gray-400 hover:bg-[#ffffff1a] rounded cursor-pointer group transition-colors"
              >
                <div className="flex items-center">
                  <span className="group-hover:hidden text-sm">{index + 1}</span>
                  <Play className="w-4 h-4 hidden group-hover:block text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={song.image} 
                    alt={song.name}
                    className="w-10 h-10 rounded" 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40/1f1f1f/ffffff?text=♪';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate group-hover:underline">
                      {song.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">{song.desc}</p>
                  </div>
                </div>
                <div className="flex items-center hidden md:block">
                  <span className="truncate">{song.album}</span>
                </div>
                <div className="flex items-center hidden sm:block">
                  <span className="text-sm">5 days ago</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm">{song.duration || '0:00'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg mb-2">No songs found in this album</p>
            <p className="text-sm">This album doesn't contain any songs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayAlbum;