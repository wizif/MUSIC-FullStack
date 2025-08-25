import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import DisplayHome from '../../pages/user/DisplayHome.jsx';
import DisplayAlbum from '../../pages/user/DisplayAlbum.jsx';

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
        displayRef.current.style.background = `linear-gradient(180deg, ${album.bgColour} 0%, #121212 60%)`;
      } else {
        displayRef.current.style.background = "#121212";
      }
    }
  }, [isAlbum, album]);

  return (
    <div
      ref={displayRef}
      className="bg-[#121212] rounded-lg flex-1 overflow-hidden flex flex-col w-full h-full"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        <Routes>
          <Route path="/" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
        </Routes>
      </div>
    </div>
  );
};

export default Display;