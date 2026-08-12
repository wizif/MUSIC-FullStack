import React from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Sidebar from './Sidebar.jsx';
import Display from './Display.jsx';
import Player from './Player.jsx';

const UserLayout = ({ children }) => {
  const { audioRef, track } = usePlayer();

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Hidden Audio Element */}
      {track && (
        <audio ref={audioRef} src={track.file || track.previewUrl} preload="auto"></audio>
      )}
      
      {/* Main Content Area - Full width layout */}
      <div className="flex flex-1 gap-2 p-2 min-h-0 w-full">
        {/* Left Sidebar - Fixed width */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Display - Takes all remaining space */}
        <div className="flex-1 min-w-0 w-full">
          <Display>
            {children}
          </Display>
        </div>
      </div>
      
      {/* Bottom Player - Full width */}
      <div className="w-full">
        <Player />
      </div>
    </div>
  );
};

export default UserLayout;