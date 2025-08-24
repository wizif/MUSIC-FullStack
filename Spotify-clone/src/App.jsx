import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      {track ? (
        <audio ref={audioRef} src={track.file} preload="auto"></audio>
      ) : null}
      
      <div className="h-[90%] flex">
        <Sidebar />
        <Display />
      </div>
      
      <Player />
    </div>
  );
};

export default App;