import React, { useContext } from "react";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    volumeBar,
    volumeBg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
    setVolumeLevel,
    volume
  } = useContext(PlayerContext);

  // Format time to always show 2 digits
  const formatTime = (timeObj) => {
    const minutes = String(timeObj.minute).padStart(2, '0');
    const seconds = String(timeObj.second).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return track ? (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      {/* Left side - Track info */}
      <div className="hidden lg:flex items-center gap-4">
        <img 
          className="w-12" 
          src={track.image} 
          alt=""
        />
        <div>
          <p>{track.name}</p>
          <p className="text-slate-200 text-sm">{track.desc?.slice(0, 12)}</p>
        </div>
      </div>

      {/* Center - Player controls */}
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img 
            className="w-4 cursor-pointer"
            src={assets.shuffle_icon}
            alt=""
          />
          <img 
            onClick={previous} 
            className="w-4 cursor-pointer" 
            src={assets.prev_icon} 
            alt=""
          />
          {playStatus ? (
            <img
              onClick={pause}
              className="w-4 cursor-pointer"
              src={assets.pause_icon}
              alt=""
            />
          ) : (
            <img
              onClick={play}
              className="w-4 cursor-pointer"
              src={assets.play_icon}
              alt=""
            />
          )}
          <img 
            onClick={next} 
            className="w-4 cursor-pointer" 
            src={assets.next_icon} 
            alt=""
          />
          <img 
            className="w-4 cursor-pointer" 
            src={assets.loop_icon} 
            alt=""
          />
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-5">
          <p className="text-sm">
            {formatTime(time.currentTime)}
          </p>
          <div
            ref={seekBg} 
            onClick={seekSong}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer h-1"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-0 bg-green-800 rounded-full"
            />
          </div>
          <p className="text-sm">
            {formatTime(time.totalTime)}
          </p>
        </div>
      </div>

      {/* Right side - Volume and other controls */}
      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <img className="w-4" src={assets.plays_icon} alt="" />
        <img className="w-4" src={assets.mic_icon} alt="" />
        <img className="w-4" src={assets.queue_icon} alt="" />
        <img className="w-4" src={assets.speaker_icon} alt="" />
        <img className="w-4" src={assets.volume_icon} alt="" />
        <div 
          ref={volumeBg}
          onClick={setVolumeLevel}
          className="w-20 bg-slate-600 h-1 rounded cursor-pointer"
        >
          <div 
            ref={volumeBar}
            className="h-1 bg-white rounded"
            style={{ width: `${volume}%` }}
          ></div>
        </div>
        <img className="w-4" src={assets.mini_player_icon} alt="" />
        <img className="w-4" src={assets.zoom_icon} alt="" />
      </div>
    </div>
  ) : null;
};

export default Player;