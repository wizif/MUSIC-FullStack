import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Navbar from './Navbar.jsx';

const Display = ({ children }) => {
  const { albumsData } = usePlayer();
  const location = useLocation();
  const displayRef = useRef(null);
  
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  const album = albumsData.find((x) => x._id === albumId);

  useEffect(() => {
    if (displayRef.current) {
      if (isAlbum && album?.bgColour) {
        const baseColor = album.bgColour.startsWith('#') ? album.bgColour : `#${album.bgColour}`;
        displayRef.current.style.background = `linear-gradient(180deg, ${baseColor}33 0%, rgba(18, 18, 18, 0.5) 60%)`;
      } else {
        displayRef.current.style.background = "rgba(18, 18, 18, 0.5)";
      }
    }
  }, [isAlbum, album]);

  return (
    <div
      ref={displayRef}
      className="bg-[#121212]/50 backdrop-blur-md border border-white/[0.04] rounded-lg flex-1 overflow-hidden flex flex-col w-full h-full"
    >
    
      
      {/* Content Area */}
      <div id="main-content-scroll" className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {children}
      </div>
    </div>
  );
};

export default Display;