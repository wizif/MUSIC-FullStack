import React, { useContext } from "react";
import Navbar from "./Navbar";
import { PlayerContext } from "../context/PlayerContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <>
      <Navbar />
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto">
          {albumsData.map((album, index) => (
            <AlbumItem 
              key={album._id} 
              image={album.image}
              name={album.name}
              desc={album.desc}
              id={album._id}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto">
          {songsData.map((song, index) => (
            <SongItem 
              key={song._id} 
              name={song.name}
              image={song.image}
              desc={song.desc}
              id={song._id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;