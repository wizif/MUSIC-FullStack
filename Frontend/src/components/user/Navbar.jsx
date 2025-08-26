// Enhanced Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, X, Music, Album } from 'lucide-react';
import RoleSwitcher from '../shared/RoleSwitcher.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { songsData, albumsData, playWithId } = usePlayer();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState({ songs: [], albums: [] });
  const [showResults, setShowResults] = useState(false);
  
  const searchRef = useRef(null);

  // Enhanced search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ songs: [], albums: [] });
      setShowResults(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    const filteredSongs = songsData.filter(song => 
      song.name.toLowerCase().includes(term) ||
      song.desc.toLowerCase().includes(term) ||
      (song.album && song.album.toLowerCase().includes(term))
    ).slice(0, 5);

    const filteredAlbums = albumsData.filter(album =>
      album.name.toLowerCase().includes(term) ||
      album.desc.toLowerCase().includes(term)
    ).slice(0, 3);

    setSearchResults({ songs: filteredSongs, albums: filteredAlbums });
    setShowResults(filteredSongs.length > 0 || filteredAlbums.length > 0);
  }, [searchTerm, songsData, albumsData]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        clearSearch();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && searchResults.songs.length > 0) {
      playWithId(searchResults.songs[0]._id);
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setIsSearchFocused(false);
  };

  const handleSongClick = (song) => {
    playWithId(song._id);
    clearSearch();
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album._id}`);
    clearSearch();
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#121212] via-[#1a1a1a] to-[#121212] p-6 pb-4 w-full border-b border-gray-800/50 backdrop-blur-md">
      <div className="flex items-center justify-between w-full">
        {/* Navigation Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 bg-[#0a0a0a] hover:bg-[#2a2a2a] p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-lg border border-gray-700/50"
          >
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </button>
          <button 
            onClick={() => navigate(1)} 
            className="w-9 h-9 bg-[#0a0a0a] hover:bg-[#2a2a2a] p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-lg border border-gray-700/50"
          >
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* Enhanced Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                isSearchFocused ? 'text-green-500' : 'text-[#a7a7a7]'
              }`} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search songs, albums, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                className={`w-[320px] lg:w-[400px] pl-12 pr-12 py-3.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-white placeholder-[#a7a7a7] focus:outline-none transition-all duration-200 text-sm border-2 ${
                  isSearchFocused 
                    ? 'border-green-500/50 bg-[#2a2a2a] shadow-lg shadow-green-500/20' 
                    : 'border-transparent hover:border-gray-600'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results */}
            {showResults && searchTerm && (
              <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-md">
                <div className="max-h-96 overflow-y-auto">
                  {/* Songs */}
                  {searchResults.songs.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Songs
                      </div>
                      {searchResults.songs.map((song) => (
                        <button
                          key={song._id}
                          onClick={() => handleSongClick(song)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#2a2a2a] transition-colors rounded-lg group"
                        >
                          <img
                            src={song.image}
                            alt={song.name}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+4pmqPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-white font-medium truncate group-hover:text-green-400">
                              {song.name}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {song.desc} • {song.album}
                            </p>
                          </div>
                          <Music className="w-4 h-4 text-gray-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Albums */}
                  {searchResults.albums.length > 0 && (
                    <div className="p-2 border-t border-gray-700">
                      <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Albums
                      </div>
                      {searchResults.albums.map((album) => (
                        <button
                          key={album._id}
                          onClick={() => handleAlbumClick(album)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#2a2a2a] transition-colors rounded-lg group"
                        >
                          <img
                            src={album.image}
                            alt={album.name}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+4pmqPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-white font-medium truncate group-hover:text-green-400">
                              {album.name}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {album.desc}
                            </p>
                          </div>
                          <Album className="w-4 h-4 text-gray-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {searchResults.songs.length === 0 && searchResults.albums.length === 0 && (
                    <div className="p-4 text-center text-gray-400">
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{searchTerm}"</p>
                    </div>
                  )}

                  {/* Search Tips */}
                  <div className="p-3 border-t border-gray-700 bg-[#141414]">
                    <p className="text-xs text-gray-500 text-center">
                      Press Enter to play first result • ESC to close • Ctrl+K to focus
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <RoleSwitcher />
          
          <div className="flex items-center gap-2">
            <button 
              className="bg-gradient-to-r from-[#1ed760] to-[#1db954] hover:from-[#1db954] hover:to-[#17a74a] text-black w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all duration-200 text-sm hover:scale-105 shadow-lg"
              title={user?.name || 'User Profile'}
            >
              {getUserInitials()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;