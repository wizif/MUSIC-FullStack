import React, { useContext } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const DisplayAlbum = ({ album }) => {
  const { id } = useParams();
  const { playWithId, albumsData, songsData } = useContext(PlayerContext);

  // Find the album by ID
  const albumData = albumsData.find(item => item._id === id) || album;

  if (!albumData) {
    return (
      <>
        <Navbar />
        <div className="text-white">Loading album...</div>
      </>
    );
  }

  // Filter songs that belong to this album
  const albumSongs = songsData.filter((item) => item.album === albumData.name);

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img 
          className="w-48 rounded" 
          src={albumData.image} 
          alt={albumData.name}
        />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-1">
            <img
              className="inline-block w-5"
              src={assets.spotify_logo}
              alt="Spotify"
            />
            <b> Spotify</b> • {albumSongs.length} songs, 
            about 2 hr 30 min
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date added</p>
        <img 
          className="m-auto w-4" 
          src={assets.clock_icon} 
          alt=""
        />
      </div>
      <hr />

      {albumSongs.length > 0 ? (
        albumSongs.map((item, index) => (
          <div
            onClick={() => playWithId(item._id)}
            key={index}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          >
            <p className="text-white">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img 
                className="inline w-10 mr-5" 
                src={item.image} 
                alt=""
              />
              {item.name}
            </p>
            <p className="text-[15px]">{item.album}</p>
            <p className="text-[15px] hidden sm:block">5 days ago</p>
            <p className="text-[15px] text-center">{item.duration}</p>
          </div>
        ))
      ) : (
        <div className="text-center text-[#a7a7a7] mt-10">
          <p>No songs found in this album</p>
        </div>
      )}
    </>
  );
};

export default DisplayAlbum;