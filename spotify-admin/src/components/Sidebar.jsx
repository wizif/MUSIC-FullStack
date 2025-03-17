import React from "react";
import { assets } from "../assets/admin-assets/assets.js";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black min-h-screen pl-[4vw]">
      <img
        className="mt-5 mr-3 w-[max(10vw, 100px)] hidden sm:block"
        src={assets.logo}
        alt=""
      />
      <img
        className="mt-5 w-[max(5vw, 40px)] mr-5 sm:hidden block"
        src={assets.logo_small}
        alt=""
      />

      <div className="flex flex-col gap-5 mt-10 mr-2">
        <NavLink
          to="/add-song"
          className="rounded-md flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw, 10px)] drop-shadow-[-4px_4px_#70AC58] text-sm font-medium"
        >
          <img className="w-5" src={assets.add_song} alt="" />
          <p className="hidden sm:block">Add Song</p>
        </NavLink>
        <NavLink
          to="list-song"
          className="rounded-md flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw, 10px)] drop-shadow-[-4px_4px_#70AC58] text-sm font-medium"
        >
          <img className="w-5" src={assets.song_icon} alt="" />
          <p className="hidden sm:block">List Song</p>
        </NavLink>
        <NavLink
          to="add-album"
          className="rounded-md flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw, 10px)] drop-shadow-[-4px_4px_#70AC58] text-sm font-medium"
        >
          <img className="w-5" src={assets.add_album} alt="" />
          <p className="hidden sm:block">Add Album</p>
        </NavLink>
        <NavLink
          to="list-album"
          className="rounded-md flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw, 10px)] drop-shadow-[-4px_4px_#70AC58] text-sm font-medium"
        >
          <img className="w-5" src={assets.album_icon} alt="" />
          <p className="hidden sm:block">List Album</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;