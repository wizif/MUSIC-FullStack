import React, { useState } from 'react';
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { usePlayer } from '../../context/PlayerContext.jsx';

const Player = () => {
  const {
    track, seekBar, seekBg, volumeBar, volumeBg, playStatus,
    play, pause, time, previous, next, seekSong, setVolumeLevel, volume,
    shuffle, repeat, toggleShuffle, toggleRepeat
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (timeObj) => {
    if (!timeObj) return '0:00';
    const minutes = String(timeObj.minute || 0).padStart(2, '0');
    const seconds = String(timeObj.second || 0).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolumeLevel({ target: { offsetX: (prevVolume / 100) * volumeBg.current?.offsetWidth } });
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolumeLevel({ target: { offsetX: 0 } });
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  if (!track) return null;

  return (
    <>
      <div className="h-20 bg-black/45 border-t border-white/[0.08] flex items-center justify-between px-4 text-white backdrop-blur-md">
        {/* Left - Current track */}
        <div className="flex items-center space-x-4 min-w-0 w-1/4">
          <div className="relative group">
            <img 
              src={track.image} 
              alt={track.name}
              className="w-14 h-14 rounded-lg object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105" 
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+4pmqPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
            {playStatus && (
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-medium truncate hover:underline cursor-pointer transition-colors hover:text-green-400">
              {track.name}
            </p>
            <p className="text-gray-400 text-sm truncate hover:underline cursor-pointer hover:text-gray-300 transition-colors">
              {track.desc}
            </p>
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`transition-all duration-200 hover:scale-110 ${
              isLiked ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center - Player controls */}
        <div className="flex flex-col items-center space-y-3 w-1/2 max-w-md">
          <div className="flex items-center space-x-6">
            <button 
              onClick={toggleShuffle}
              className={`transition-all duration-200 hover:scale-110 ${
                shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button 
              onClick={previous} 
              className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 p-1"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            
            <button
              onClick={playStatus ? pause : play}
              className="bg-white text-black rounded-full p-3 hover:scale-105 transition-all duration-200 shadow-lg hover:bg-gray-100 hover:shadow-xl"
              title={playStatus ? 'Pause' : 'Play'}
            >
              {playStatus ? 
                <Pause className="w-6 h-6 fill-current" /> : 
                <Play className="w-6 h-6 fill-current ml-0.5" />
              }
            </button>
            
            <button 
              onClick={next} 
              className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 p-1"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            
            <button 
              onClick={toggleRepeat}
              className={`transition-all duration-200 hover:scale-110 ${
                repeat ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full">
            <span className="text-xs text-gray-400 w-12 text-right font-mono">
              {formatTime(time.currentTime)}
            </span>
            <div
              ref={seekBg}
              onClick={seekSong}
              className="flex-1 bg-gray-600 rounded-full cursor-pointer h-1 group relative hover:h-1.5 transition-all duration-200"
            >
              <div
                ref={seekBar}
                className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-all duration-200"
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-gray-800"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-12 font-mono">
              {formatTime(time.totalTime)}
            </span>
          </div>
        </div>

        {/* Right - Volume and controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1">
            <ListMusic className="w-4 h-4" />
          </button>
          
          <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1">
            <Share2 className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          
          <div 
            ref={volumeBg}
            onClick={setVolumeLevel}
            className="w-24 bg-gray-600 h-1 rounded cursor-pointer group relative hover:h-1.5 transition-all duration-200"
          >
            <div 
              ref={volumeBar}
              className="h-full bg-white rounded group-hover:bg-green-500 transition-all duration-200 relative"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-gray-800"></div>
            </div>
          </div>

          <button 
            onClick={() => setIsFullPlayer(!isFullPlayer)}
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1"
            title="Full screen player"
          >
            {isFullPlayer ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="absolute bottom-20 right-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl backdrop-blur-md">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Up Next</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-400 text-sm">Queue functionality coming soon...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;