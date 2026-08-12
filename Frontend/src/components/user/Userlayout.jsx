import React from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Sidebar from './Sidebar.jsx';
import Display from './Display.jsx';
import Player from './Player.jsx';
import Scanner from '../shared/Scanner.jsx';

const UserLayout = ({ children }) => {
  const { audioRef, track } = usePlayer();

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden relative">
      {/* Hidden Audio Element */}
      {track && (
        <audio ref={audioRef} src={track.file || track.previewUrl} preload="auto"></audio>
      )}

      {/* Background Scanner Visual */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <Scanner
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.5}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1.0}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline={true}
          grain={true}
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction={true}
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>
      
      {/* Main Content Area - Full width layout */}
      <div className="flex flex-1 gap-2 p-2 min-h-0 w-full z-10 relative">
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
      <div className="w-full z-10 relative">
        <Player />
      </div>
    </div>
  );
};

export default UserLayout;