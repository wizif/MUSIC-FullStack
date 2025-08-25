import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

const Player = () => {
  const {
    track, seekBar, seekBg, volumeBar, volumeBg, playStatus,
    play, pause, time, previous, next, seekSong, setVolumeLevel, volume,
    shuffle, repeat, toggleShuffle, toggleRepeat
  } = usePlayer();

  const formatTime = (timeObj) => {
    if (!timeObj) return '0:00';
    const minutes = String(timeObj.minute || 0).padStart(2, '0');
    const seconds = String(timeObj.second || 0).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (!track) return null;

  return (
    <div className="h-20 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 flex items-center justify-between px-4 text-white">
      {/* Left - Current track */}
      <div className="flex items-center space-x-4 min-w-0 w-1/4">
        <img 
          src={track.image} 
          alt={track.name}
          className="w-14 h-14 rounded object-cover shadow-lg" 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/56x56/1f1f1f/ffffff?text=♪';
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium truncate hover:underline cursor-pointer">
            {track.name}
          </p>
          <p className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
            {track.desc}
          </p>
        </div>
        <button className="text-gray-400 hover:text-green-500 transition-colors hover:scale-110 transform">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Center - Player controls */}
      <div className="flex flex-col items-center space-y-2 w-1/2 max-w-md">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleShuffle}
            className={`transition-colors hover:scale-110 transform ${
              shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={previous} 
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
            title="Previous"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={playStatus ? pause : play}
            className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform shadow-lg hover:bg-gray-100"
            title={playStatus ? 'Pause' : 'Play'}
          >
            {playStatus ? 
              <Pause className="w-5 h-5" /> : 
              <Play className="w-5 h-5 fill-current ml-0.5" />
            }
          </button>
          
          <button 
            onClick={next} 
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
            title="Next"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleRepeat}
            className={`transition-colors hover:scale-110 transform ${
              repeat ? 'text-green-500' : 'text-gray-400 hover:text-white'
            }`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(time.currentTime)}
          </span>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="flex-1 bg-gray-600 rounded-full cursor-pointer h-1 group relative"
          >
            <div
              ref={seekBar}
              className="h-1 bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
            </div>
          </div>
          <span className="text-xs text-gray-400 w-10">
            {formatTime(time.totalTime)}
          </span>
        </div>
      </div>

      {/* Right - Volume and other controls */}
      <div className="flex items-center space-x-3 w-1/4 justify-end">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <div 
          ref={volumeBg}
          onClick={setVolumeLevel}
          className="w-20 bg-gray-600 h-1 rounded cursor-pointer group relative"
        >
          <div 
            ref={volumeBar}
            className="h-1 bg-white rounded group-hover:bg-green-500 transition-colors relative"
            style={{ width: `${volume}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;