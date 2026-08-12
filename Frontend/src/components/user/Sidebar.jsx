import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Search, Library, Plus, Heart, Download, 
  ChevronRight, ChevronDown, Play, Music, Clock,
  List, Grid, MoreHorizontal
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const { albumsData, songsData, playWithId, track, playStatus } = usePlayer();
  const [imageErrors, setImageErrors] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'playlists', 'artists', 'albums'
  const [likedSongs, setLikedSongs] = useState([]);
  
  // Simulate liked songs (in real app, this would come from user data)
  useEffect(() => {
    if (songsData.length > 0) {
      // Take first 5 songs as "liked" for demo
      setLikedSongs(songsData.slice(0, 5));
    }
  }, [songsData]);

  const handleImageError = (e, itemId) => {
    if (!imageErrors.has(itemId)) {
      setImageErrors(prev => new Set([...prev, itemId]));
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMWYxZjFmIi8+CjxwYXRoIGQ9Ik0yNCAzNkMyNy4zMTM3IDM2IDMwIDMzLjMxMzcgMzAgMzBDMzAgMjYuNjg2MyAyNy4zMTM3IDI0IDI0IDI0QzIwLjY4NjMgMjQgMTggMjYuNjg2MyAxOCAzMEMxOCAzMy4zMTM3IDIwLjY4NjMgMzYgMjQgMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMTJDMjUuMTA0NiAxMiAyNiAxMi44OTU0IDI2IDE0VjIyQzI2IDIzLjEwNDYgMjUuMTA0NiAyNCAyNCAyNEMyMi44OTU0IDI0IDIyIDIzLjEwNDYgMjIgMjJWMTRDMjIgMTIuODk1NCAyMi44OTU0IDEyIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    }
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    return duration;
  };

  const getFilteredContent = () => {
    switch (selectedCategory) {
      case 'albums':
        return albumsData.map(album => ({
          ...album,
          type: 'album',
          subtitle: `Album • ${songsData.filter(song => song.album === album.name || song.album === album._id).length} songs`
        }));
      case 'playlists':
        return [
          {
            _id: 'liked-songs',
            name: 'Liked Songs',
            type: 'playlist',
            subtitle: `Playlist • ${likedSongs.length} songs`,
            image: null,
            isLikedSongs: true
          }
        ];
      case 'artists':
        // Extract unique artists from songs
        const artists = [...new Set(songsData.map(song => song.desc))].map((artist, index) => ({
          _id: `artist-${index}`,
          name: artist,
          type: 'artist',
          subtitle: `Artist • ${songsData.filter(song => song.desc === artist).length} songs`,
          image: songsData.find(song => song.desc === artist)?.image
        }));
        return artists;
      default:
        return [
          {
            _id: 'liked-songs',
            name: 'Liked Songs',
            type: 'playlist',
            subtitle: `Playlist • ${likedSongs.length} songs`,
            image: null,
            isLikedSongs: true
          },
          ...albumsData.map(album => ({
            ...album,
            type: 'album',
            subtitle: `Album • ${songsData.filter(song => song.album === album.name || song.album === album._id).length} songs`
          }))
        ];
    }
  };

  const getSongsForItem = (item) => {
    if (item.isLikedSongs) {
      return likedSongs;
    } else if (item.type === 'album') {
      return songsData.filter(song => song.album === item.name || song.album === item._id);
    } else if (item.type === 'artist') {
      return songsData.filter(song => song.desc === item.name);
    }
    return [];
  };

  const renderExpandedContent = (item) => {
    const songs = getSongsForItem(item);
    
    return (
      <div className="ml-6 mr-2 mb-2 bg-[#1a1a1a] rounded-md overflow-hidden">
        <div className="max-h-48 overflow-y-auto">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => playWithId(song._id)}
                className={`flex items-center gap-3 p-2 hover:bg-[#2a2a2a] cursor-pointer transition-colors group ${
                  track?._id === song._id ? 'bg-[#2a2a2a]' : ''
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                  {track?._id === song._id && playStatus ? (
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-3 bg-green-500 animate-pulse"></div>
                      <div className="w-0.5 h-3 bg-green-500 animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-0.5 h-3 bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-400 group-hover:hidden text-xs">
                        {index + 1}
                      </span>
                      <Play className="w-3 h-3 text-white hidden group-hover:block fill-current" />
                    </>
                  )}
                </div>
                
                <img 
                  src={song.image} 
                  alt={song.name}
                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                  onError={(e) => handleImageError(e, song._id)}
                />
                
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${
                    track?._id === song._id ? 'text-green-500' : 'text-white'
                  }`}>
                    {song.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {song.desc}
                  </p>
                </div>
                
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatDuration(song.duration)}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              No songs found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[350px] flex flex-col gap-2 flex-shrink-0">
      {/* Top Navigation */}
      <div className="bg-[#121212] rounded-lg p-6">
        <div className="space-y-6">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-5 text-gray-300 hover:text-white cursor-pointer transition-colors group"
          >
            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[16px]">Home</span>
          </div>
          
          <div 
            onClick={() => navigate("/profile/mine")} 
            className="flex items-center gap-5 text-gray-300 hover:text-white cursor-pointer transition-colors group"
          >
            <Music className="w-6 h-6 group-hover:scale-110 transition-transform text-[#1ED760]" />
            <span className="font-bold text-[16px]">My Uploads</span>
          </div>
          
          <div className="flex items-center gap-5 text-gray-300 hover:text-white cursor-pointer transition-colors group">
            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[16px]">Search</span>
          </div>
        </div>
      </div>
      
      {/* Your Library */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col min-h-0">
        {/* Library Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer transition-colors group">
            <Library className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[16px]">Your Library</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1 hover:bg-[#1a1a1a] rounded"
              title={viewMode === 'list' ? 'Grid view' : 'List view'}
            >
              {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1 hover:bg-[#1a1a1a] rounded">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'All' },
              { id: 'playlists', label: 'Playlists' },
              { id: 'artists', label: 'Artists' },
              { id: 'albums', label: 'Albums' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedCategory(filter.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === filter.id
                    ? 'bg-white text-black'
                    : 'bg-[#232323] hover:bg-[#2a2a2a] text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Library Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1 min-h-0">
          {getFilteredContent().map((item) => (
            <div key={item._id} className="space-y-1">
              <div 
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors group"
                onClick={() => {
                  if (item.type === 'album') {
                    navigate(`/album/${item._id}`);
                  } else {
                    toggleExpanded(item._id);
                  }
                }}
              >
                {/* Image or Icon */}
                <div className="w-12 h-12 flex-shrink-0 relative">
                  {item.isLikedSongs ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                  ) : item.image ? (
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => handleImageError(e, item._id)}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center">
                      <Music className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Play button overlay for albums */}
                  {item.type === 'album' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                {/* Content Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-[15px] font-medium truncate">{item.name}</p>
                  <p className="text-gray-400 text-[13px] truncate">{item.subtitle}</p>
                </div>
                
                {/* Expand/Collapse Arrow for expandable items */}
                {item.type !== 'album' && getSongsForItem(item).length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(item._id);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    {expandedItems.has(item._id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Expanded Content */}
              {expandedItems.has(item._id) && renderExpandedContent(item)}
            </div>
          ))}
          
          {/* Empty State */}
          {getFilteredContent().length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-white mb-2">Nothing here</p>
                <p className="text-sm">Your {selectedCategory === 'all' ? 'library' : selectedCategory} will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;