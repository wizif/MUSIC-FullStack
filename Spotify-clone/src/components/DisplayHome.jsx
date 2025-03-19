import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext"; // Corrected path
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-4">Albums</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albumsData.map((album) => (
          <AlbumItem key={album._id} album={album} />
        ))}
      </div>

      <h2 className="text-white text-2xl font-bold mt-6 mb-4">Songs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songsData.map((song, index) => (
          <SongItem key={song._id || index} song={song} />
        ))}
      </div>
    </div>
  );
};

export default DisplayHome;
