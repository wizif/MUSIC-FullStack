import React from 'react';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

const SongItem = ({ song, className = '', showPlayButton = true }) => {
  const { playWithId } = usePlayer();

  const handlePlay = () => {
    if (song && song._id) {
      playWithId(song._id);
    }
  };

  if (!song) {
    return (
      <div className="min-w-[180px] p-3 rounded-lg bg-gray-800 animate-pulse">
        <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={handlePlay}
      className={`min-w-[180px] p-3 rounded-lg cursor-pointer hover:bg-[#ffffff26] transition-all duration-200 group ${className}`}
    >
      <div className="relative">
        <img 
          className="w-full aspect-square rounded-lg object-cover mb-4 group-hover:brightness-75 transition-all duration-200" 
          src={song.image} 
          alt={song.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/1f1f1f/ffffff?text=No+Image';
          }}
        />
        
        {showPlayButton && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-green-500 rounded-full p-3 hover:bg-green-400 hover:scale-105 transition-all duration-200 shadow-lg">
              <Play className="w-5 h-5 text-black fill-black" />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="font-bold text-white mb-1 truncate" title={song.name}>
          {song.name}
        </p>
        <p className="text-gray-400 text-sm truncate" title={song.desc}>
          {song.desc}
        </p>
        {song.duration && (
          <p className="text-gray-500 text-xs">
            {song.duration}
          </p>
        )}
      </div>
    </div>
  );
};

export default SongItem;