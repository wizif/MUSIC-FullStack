import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      {songsData.length !== 0 ? (
        <>
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      ) : (
        // ✅ Optional: Add loading state
        <div className="h-screen flex items-center justify-center text-white">
          <p>Loading songs...</p>
        </div>
      )}
      {/* ✅ Fixed: Only render audio element when track exists and has a file */}
      {track && track.file && (
        <audio ref={audioRef} src={track.file} preload="auto"></audio>
      )}
    </div>
  );
};

export default App;