import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Search, Library, Plus, Heart,
  ChevronRight, ChevronDown, Play, Music,
  List, Grid, Trash2, X, Disc3, Image
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { albumAPI, validateFile } from '../../utils/api.js';
import EchoText from '../shared/EchoText.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    albumsData, 
    songsData, 
    playTrack,
    track, 
    playStatus, 
    playlists, 
    createPlaylist,
    deletePlaylist,
    loadSongs,
  } = usePlayer();
  const [imageErrors, setImageErrors] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'playlists', 'artists', 'albums'
  
  // Custom Playlist Creator Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPrivatePlaylist, setIsPrivatePlaylist] = useState(true);
  const [playlistError, setPlaylistError] = useState('');
  const [creatingPlaylistState, setCreatingPlaylistState] = useState(false);

  // Create menu dropdown state
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const createMenuRef = useRef(null);

  // Close create menu on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setShowCreateMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Album Creator Modal state
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [albumImageFile, setAlbumImageFile] = useState(null);
  const [albumImagePreview, setAlbumImagePreview] = useState(null);
  const [albumError, setAlbumError] = useState('');
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const albumImageRef = useRef(null);

  const handleAlbumImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateFile(file, 'image');
      setAlbumImageFile(file);
      setAlbumImagePreview(URL.createObjectURL(file));
      setAlbumError('');
    } catch (err) {
      setAlbumError(err.message);
    }
  };

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    if (!albumName.trim()) { setAlbumError('Album name is required'); return; }
    if (!albumImageFile) { setAlbumError('Cover art is required'); return; }
    setCreatingAlbum(true);
    setAlbumError('');
    try {
      const res = await albumAPI.add({
        name: albumName.trim(),
        desc: albumDesc.trim(),
        bgColour: '#121212',
        imageFile: albumImageFile,
      });
      if (!res.success) throw new Error(res.message || 'Failed to create album');
      // Reload global album list
      await loadSongs();
      setIsAlbumModalOpen(false);
      setAlbumName('');
      setAlbumDesc('');
      setAlbumImageFile(null);
      setAlbumImagePreview(null);
      if (albumImageRef.current) albumImageRef.current.value = '';
    } catch (err) {
      setAlbumError(err.message || 'Failed to create album');
    } finally {
      setCreatingAlbum(false);
    }
  };

  // Find Liked Songs playlist
  const likedSongsPlaylist = playlists.find(p => p.name === 'Liked Songs');
  const likedSongs = likedSongsPlaylist ? likedSongsPlaylist.songs : [];

  const handleCreatePlaylist = () => {
    setIsCreateModalOpen(true);
    setPlaylistError('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      setPlaylistError('Playlist name is required');
      return;
    }
    setCreatingPlaylistState(true);
    setPlaylistError('');
    try {
      await createPlaylist(newPlaylistName.trim(), isPrivatePlaylist);
      setIsCreateModalOpen(false);
      setNewPlaylistName('');
      setIsPrivatePlaylist(true);
    } catch (err) {
      setPlaylistError(err.message || 'Failed to create playlist. Make sure you are logged in.');
    } finally {
      setCreatingPlaylistState(false);
    }
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await deletePlaylist(playlistId);
      // Clean up expanded state if it was expanded
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(playlistId);
        return newSet;
      });
    } catch (err) {
      alert(err.message || "Failed to delete playlist");
    }
  };

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
          },
          ...playlists.filter(p => p.name !== 'Liked Songs').map(p => ({
            ...p,
            type: 'playlist',
            subtitle: `Playlist • ${p.songs?.length || 0} songs`,
            image: p.songs?.[0]?.image || null
          }))
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
          ...playlists.filter(p => p.name !== 'Liked Songs').map(p => ({
            ...p,
            type: 'playlist',
            subtitle: `Playlist • ${p.songs?.length || 0} songs`,
            image: p.songs?.[0]?.image || null
          })),
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
    } else if (item.type === 'playlist') {
      const playlist = playlists.find(p => p._id === item._id);
      return playlist ? playlist.songs : [];
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
                onClick={() => playTrack(song)}
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
      {/* App Logo */}
      <div style={{ padding: '16px 12px 8px', overflow: 'hidden' }}>
        <EchoText
          text="MusicOn"
          echoes={8}
          lag={0.22}
          offset={28}
          direction="right"
          fade={0.68}
          blur={2.5}
          tint="#1ED760"
          mode="both"
          cursorRadius={280}
          duration={800}
          ease="ease-out"
          fontSize="1.7rem"
          fontWeight={800}
          color="#ffffff"
        />
      </div>

      {/* Top Navigation */}
      <div style={{ background: 'rgba(18,18,18,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '12px' }}>

        {/* Nav item helper — rendered inline so styles are 100% reliable */}
        {[
          {
            label: 'Home',
            icon: (active) => (
              <Home style={{ width: 22, height: 22, color: active ? '#1ED760' : '#9ca3af', flexShrink: 0, transition: 'transform 0.15s' }} />
            ),
            active: location.pathname === '/',
            onClick: () => navigate('/'),
          },
          {
            label: 'My Uploads',
            icon: (active) => (
              <Music style={{ width: 22, height: 22, color: active ? '#1ED760' : '#9ca3af', flexShrink: 0, transition: 'transform 0.15s' }} />
            ),
            active: location.pathname.startsWith('/profile'),
            onClick: () => navigate('/profile/mine'),
          },
          {
            label: 'Search',
            icon: (active) => (
              <Search style={{ width: 22, height: 22, color: active ? '#1ED760' : '#9ca3af', flexShrink: 0, transition: 'transform 0.15s' }} />
            ),
            // Search lives inside the home page — it is never a standalone "active" route
            active: false,
            onClick: () => {
              navigate('/');
              setTimeout(() => {
                const input = document.querySelector('input[placeholder*="Search songs"]');
                if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
              }, 100);
            },
          },
        ].map(({ label, icon, active, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 2,
              transition: 'background 0.15s',
              background: active ? 'rgba(30,215,96,0.13)' : 'transparent',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Green left-bar indicator — absolutely positioned INSIDE the item */}
            {active && (
              <span style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: 20,
                borderRadius: '0 3px 3px 0',
                background: '#1ED760',
              }} />
            )}
            {icon(active)}
            <span style={{
              fontSize: 15,
              fontWeight: active ? 800 : 600,
              color: active ? '#1ED760' : '#9ca3af',
              letterSpacing: active ? '-0.01em' : 'normal',
            }}>
              {label}
            </span>
            {/* Active dot on right */}
            {active && (
              <span style={{
                marginLeft: 'auto',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#1ED760',
                flexShrink: 0,
              }} />
            )}
          </div>
        ))}

      </div>
      
      {/* Your Library */}
      <div className="bg-[#121212]/50 backdrop-blur-md border border-white/[0.04] rounded-lg flex-1 flex flex-col min-h-0">
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

            {/* Single + button → dropdown: Playlist / Album */}
            <div className="relative" ref={createMenuRef}>
              <button
                onClick={() => setShowCreateMenu(prev => !prev)}
                className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-1 hover:bg-[#1a1a1a] rounded"
                title="Create…"
              >
                <Plus className="w-4 h-4" />
              </button>

              {showCreateMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#18181f] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-30 py-1">
                  <button
                    onClick={() => { setShowCreateMenu(false); handleCreatePlaylist(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <Plus className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    New Playlist
                  </button>
                  <button
                    onClick={() => { setShowCreateMenu(false); setIsAlbumModalOpen(true); setAlbumError(''); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <Disc3 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    New Album
                  </button>
                </div>
              )}
            </div>
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
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className={viewMode === 'list' ? 'space-y-1' : 'grid grid-cols-2 gap-3'}>
            {getFilteredContent().map((item) => {
              const isExpanded = expandedItems.has(item._id);
              return (
                <div 
                  key={item._id} 
                  className={`space-y-1 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? (isExpanded ? 'col-span-2' : 'col-span-1') 
                      : ''
                  }`}
                >
                  {viewMode === 'list' ? (
                    // List View Item
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
                      
                      {/* Delete Playlist button */}
                      {item.type === 'playlist' && !item.isLikedSongs && (
                        <button
                          onClick={(e) => handleDeletePlaylist(item._id, e)}
                          className="text-gray-500 hover:text-rose-500 transition-colors p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#282828] rounded transition-all duration-200"
                          title="Delete playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {item.type !== 'album' && getSongsForItem(item).length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(item._id);
                          }}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    // Grid View Item (Card View)
                    <div 
                      className={`flex flex-col items-center text-center p-3 rounded-xl cursor-pointer transition-all duration-300 group border ${
                        isExpanded 
                          ? 'bg-white/[0.08] border-white/[0.12] shadow-xl' 
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.04] hover:border-white/[0.08]'
                      }`}
                      onClick={() => {
                        if (item.type === 'album') {
                          navigate(`/album/${item._id}`);
                        } else {
                          toggleExpanded(item._id);
                        }
                      }}
                    >
                      {/* Card Image */}
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-3">
                        {item.isLikedSongs ? (
                          <div className="w-full h-full bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-white fill-white" />
                          </div>
                        ) : item.image ? (
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => handleImageError(e, item._id)}
                          />
                        ) : (
                          <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                            <Music className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Trash Button for Custom Playlists in Grid */}
                        {item.type === 'playlist' && !item.isLikedSongs && (
                          <button
                            onClick={(e) => handleDeletePlaylist(item._id, e)}
                            className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-rose-600 text-gray-400 hover:text-white rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm z-20"
                            title="Delete playlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.type === 'album' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                              <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Card Info */}
                      <div className="w-full min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs truncate mt-0.5">{item.subtitle.split(' • ')[0]}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Expanded Content */}
                  {isExpanded && renderExpandedContent(item)}
                </div>
              );
            })}
          </div>
          
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

        {/* ── Create Playlist Modal ── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#18181f] border border-white/[0.08] p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-500" />
                  Create Playlist
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {playlistError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">{playlistError}</div>
              )}
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Playlist Name *</label>
                  <input
                    type="text" value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My Awesome Playlist"
                    className="w-full p-3 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                    disabled={creatingPlaylistState} required autoFocus
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all"
                    disabled={creatingPlaylistState}>Cancel</button>
                  <button type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-green-500 hover:bg-green-400 text-black rounded-xl transition-all min-w-[80px]"
                    disabled={creatingPlaylistState}>
                    {creatingPlaylistState ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Create Album Modal ── */}
        {isAlbumModalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#18181f] border border-white/[0.08] p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-green-500" />
                  Create Album
                </h3>
                <button onClick={() => { setIsAlbumModalOpen(false); setAlbumImageFile(null); setAlbumImagePreview(null); }}
                  className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {albumError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">{albumError}</div>
              )}

              <form onSubmit={handleAlbumSubmit} className="space-y-4">
                {/* Album Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Album Name *</label>
                  <input
                    type="text" value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="My Album"
                    className="w-full p-3 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                    disabled={creatingAlbum} required autoFocus
                  />
                </div>

                {/* Description (optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Description <span className="normal-case font-normal">(optional)</span></label>
                  <input
                    type="text" value={albumDesc}
                    onChange={(e) => setAlbumDesc(e.target.value)}
                    placeholder="Short description…"
                    className="w-full p-3 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none rounded-xl text-white placeholder-gray-500 text-sm transition-all"
                    disabled={creatingAlbum}
                  />
                </div>

                {/* Cover Art */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Cover Art *</label>
                  {!albumImagePreview ? (
                    <div
                      onClick={() => !creatingAlbum && albumImageRef.current?.click()}
                      className="border-2 border-dashed border-white/[0.08] hover:border-green-500/50 rounded-xl p-5 text-center cursor-pointer transition-all group bg-black/20"
                    >
                      <Image className="w-8 h-8 text-gray-500 mx-auto mb-1.5 group-hover:text-green-400 transition-colors" />
                      <p className="text-xs text-gray-400 group-hover:text-white transition-colors">Click to upload cover art</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">JPEG, PNG, WEBP · max 5MB</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden" style={{ height: 120 }}>
                      <img src={albumImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => { setAlbumImageFile(null); setAlbumImagePreview(null); if (albumImageRef.current) albumImageRef.current.value = ''; }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <input ref={albumImageRef} type="file" accept="image/*" onChange={handleAlbumImageChange} className="hidden" disabled={creatingAlbum} />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button type="button"
                    onClick={() => { setIsAlbumModalOpen(false); setAlbumImageFile(null); setAlbumImagePreview(null); }}
                    className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all"
                    disabled={creatingAlbum}>Cancel</button>
                  <button type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-green-500 hover:bg-green-400 text-black rounded-xl transition-all min-w-[80px]"
                    disabled={creatingAlbum}>
                    {creatingAlbum ? 'Creating...' : 'Create Album'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;