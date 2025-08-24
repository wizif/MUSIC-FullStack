import React, { useState, useContext } from "react";
import { assets } from "../assets/frontend-assets/assets";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { songsData, albumsData } = useContext(PlayerContext);

  // Filter search results
  const searchResults = {
    songs: songsData.filter(song => 
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.desc.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    albums: albumsData.filter(album => 
      album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.length > 0);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt=""
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt=""
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mx-4">
          <div className="relative">
            <img 
              src={assets.search_icon} 
              alt="" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (searchResults.songs.length > 0 || searchResults.albums.length > 0) && (
            <div className="absolute top-full mt-2 w-full bg-[#282828] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.songs.length > 0 && (
                <div className="p-2">
                  <h3 className="text-white font-semibold mb-2">Songs</h3>
                  {searchResults.songs.slice(0, 5).map((song) => (
                    <div 
                      key={song._id}
                      className="flex items-center gap-3 p-2 hover:bg-[#3e3e3e] rounded cursor-pointer"
                      onClick={() => {
                        setShowResults(false);
                        setSearchTerm("");
                      }}
                    >
                      <img src={song.image} alt="" className="w-10 h-10 rounded" />
                      <div>
                        <p className="text-white font-medium">{song.name}</p>
                        <p className="text-gray-400 text-sm">{song.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.albums.length > 0 && (
                <div className="p-2">
                  <h3 className="text-white font-semibold mb-2">Albums</h3>
                  {searchResults.albums.slice(0, 3).map((album) => (
                    <div 
                      key={album._id}
                      className="flex items-center gap-3 p-2 hover:bg-[#3e3e3e] rounded cursor-pointer"
                      onClick={() => {
                        navigate(`/album/${album._id}`);
                        setShowResults(false);
                        setSearchTerm("");
                      }}
                    >
                      <img src={album.image} alt="" className="w-10 h-10 rounded" />
                      <div>
                        <p className="text-white font-medium">{album.name}</p>
                        <p className="text-gray-400 text-sm">Album • {album.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
            Explore Premium
          </p>
          <p className="bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer">
            Install App
          </p>
          <p className="bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center">
            D
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className="bg-black px-4 py-1 rounded-2xl cursor-pointer">Music</p>
        <p className="bg-black px-4 py-1 rounded-2xl cursor-pointer">Podcasts</p>
      </div>

      {/* Close search results when clicking outside */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;