import React, { useState, useEffect, useRef } from 'react';
import { Play, Music, Disc3, Upload, TrendingUp, Pause, ExternalLink, Headphones, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/user/Navbar.jsx';
import AlbumItem from '../../components/shared/AlbumItem.jsx';
import BorderGlow from '../../components/shared/BorderGlow.jsx';
import { fetchSoundCloudDiscovery } from '../../utils/soundcloudApi.js';

/* ────────────────────────────────────────────────
   Skeleton — shape-matched placeholder rows
──────────────────────────────────────────────── */
const SongRowSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-xl">
    <div className="skeleton w-12 h-12 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3.5 w-48 rounded" />
      <div className="skeleton h-3 w-28 rounded" />
    </div>
    <div className="skeleton h-3 w-10 rounded" />
  </div>
);

const CardSkeleton = () => (
  <div className="flex-shrink-0 w-44 space-y-3">
    <div className="skeleton w-44 h-44 rounded-xl" />
    <div className="skeleton h-3.5 w-32 rounded" />
    <div className="skeleton h-3 w-20 rounded" />
  </div>
);

/* ────────────────────────────────────────────────
   iTunes external track card
──────────────────────────────────────────────── */
const ExternalTrackCard = ({ track, isPreviewPlaying, onPreviewToggle, isLiked, onLikeToggle, playlists, onAddToPlaylist }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPlaylists(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="flex-shrink-0 w-44 group relative">
      <div className="relative w-44 h-44 rounded-xl overflow-hidden mb-3">
        <img
          src={track.image}
          alt={track.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMWExYSI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiLz48L3N2Zz4='; }}
        />
        {/* Play button */}
        {(track.previewUrl || track.transcodingUrl || track.file) && (
          <button
            onClick={() => onPreviewToggle(track)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              {isPreviewPlaying
                ? <Pause className="w-5 h-5 text-black fill-black" />
                : <Play className="w-5 h-5 text-black fill-black ml-0.5" />}
            </div>
          </button>
        )}
        {/* External link */}
        {track.externalUrl && (
          <a
            href={track.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            title="Open in SoundCloud"
          >
            <ExternalLink className="w-3 h-3 text-white" />
          </a>
        )}
        {/* Now playing indicator */}
        {isPreviewPlaying && (
          <div className="absolute bottom-2 left-2">
            <span className="waveform-indicator"><span/><span/><span/><span/></span>
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-semibold truncate" title={track.name}>{track.name}</p>
          <p className="text-gray-500 text-xs truncate mt-0.5">{track.desc}</p>
        </div>
        
        {/* Like and Plus buttons */}
        <div className="flex items-center gap-1 mt-0.5">
          <button 
            onClick={(e) => { e.stopPropagation(); onLikeToggle(track); }}
            className="text-gray-400 hover:text-green-500 transition-colors p-1"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-green-500 fill-green-500' : ''}`} />
          </button>
          
          {playlists && playlists.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPlaylists(!showPlaylists); }}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              {showPlaylists && (
                <div className="absolute right-0 bottom-full mb-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl overflow-hidden py-1 z-30">
                  {playlists.filter(p => p.name !== 'Liked Songs').map(p => (
                    <button
                      key={p._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToPlaylist(p._id, track);
                        setShowPlaylists(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white truncate"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {track.duration && <p className="text-gray-600 text-xs mt-0.5">{track.duration}</p>}
    </div>
  );
};

/* ────────────────────────────────────────────────
   Empty state
──────────────────────────────────────────────── */
const EmptyFeed = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
    <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
      <Music className="w-9 h-9 text-gray-600" />
    </div>
    <div>
      <p className="text-white font-semibold text-lg">Nothing here yet</p>
      <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
        Be the first to upload a track. Everything uploaded by any user shows up here.
      </p>
    </div>
    <button
      onClick={() => navigate('/profile/mine')}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105"
    >
      <Upload className="w-4 h-4" />
      Upload your first track
    </button>
  </div>
);

/* ────────────────────────────────────────────────
   Song row — clickable list item
──────────────────────────────────────────────── */
const SongRow = ({ song, index, isPlaying, onPlay, isLiked, onLikeToggle, playlists, onAddToPlaylist }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPlaylists(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group text-left relative">
      <button
        onClick={() => onPlay(song)}
        className="flex-1 flex items-center gap-4 text-left min-w-0"
      >
        <span className={`w-5 text-center text-xs flex-shrink-0 font-medium ${isPlaying ? 'text-green-400' : 'text-gray-500 group-hover:hidden'}`}>
          {isPlaying ? (
            <span className="waveform-indicator">
              <span /><span /><span /><span />
            </span>
          ) : (
            index + 1
          )}
        </span>
        <Play className={`w-3.5 h-3.5 text-white hidden group-hover:block flex-shrink-0 ${isPlaying ? '!hidden' : ''}`} />

        <img
          src={song.image}
          alt={song.name}
          className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
          onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjwvc3ZnPg=='; }}
        />

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isPlaying ? 'text-green-400' : 'text-white'}`}>
            {song.name}
          </p>
          <p className="text-gray-500 text-xs truncate mt-0.5">{song.desc}</p>
        </div>

        {song.album && (
          <span className="text-gray-500 text-xs truncate hidden md:block max-w-[120px] mr-4">{song.album}</span>
        )}
      </button>

      <div className="flex items-center gap-3.5 z-10">
        {/* Heart icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); onLikeToggle(song); }}
          className="text-gray-400 hover:text-green-400 transition-colors p-1 hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-green-500 fill-green-500' : ''}`} />
        </button>

        {/* Plus / Add to Playlist */}
        {playlists && playlists.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowPlaylists(!showPlaylists); }}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:scale-110"
              title="Add to Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
            {showPlaylists && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl overflow-hidden py-1">
                <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-800 font-semibold mb-1">Add to Playlist</div>
                {playlists.filter(p => p.name !== 'Liked Songs').map(p => (
                  <button
                    key={p._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPlaylist(p._id, song);
                      setShowPlaylists(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a2a] hover:text-white truncate"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {song.duration && (
          <span className="text-gray-500 text-xs flex-shrink-0 font-medium w-10 text-right">{song.duration}</span>
        )}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────
   Main page
──────────────────────────────────────────────── */
const RecentlyPlayedCard = ({ song, isPlaying, onPlayToggle }) => (
  <div className="flex items-center gap-3 p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.04] rounded-xl transition-all duration-300 group relative overflow-hidden">
    <img 
      src={song.image} 
      alt={song.name} 
      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
      onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjwvc3ZnPg=='; }}
    />
    <div className="flex-1 min-w-0 pr-12">
      <p className={`font-bold text-sm truncate ${isPlaying ? 'text-green-400' : 'text-white'}`}>{song.name}</p>
      <p className="text-gray-400 text-xs truncate mt-0.5">{song.desc}</p>
    </div>
    
    <button 
      onClick={() => onPlayToggle(song)}
      className="absolute right-3 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:scale-105"
    >
      {isPlaying ? <Pause className="w-4 h-4 text-black fill-black" /> : <Play className="w-4 h-4 text-black fill-black ml-0.5" />}
    </button>
  </div>
);

const DisplayHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    songsData, 
    albumsData, 
    songsLoading, 
    albumsLoading, 
    playWithId, 
    playTrack, 
    play, 
    pause, 
    track, 
    playStatus,
    recentlyPlayed,
    playlists,
    toggleLikeTrack,
    addTrackToPlaylist
  } = usePlayer();

  const likedSongsPlaylist = playlists.find(p => p.name === 'Liked Songs');
  const likedSongIds = new Set(likedSongsPlaylist ? likedSongsPlaylist.songs.map(s => s._id) : []);

  // SoundCloud discovery
  const [discoveryTracks, setDiscoveryTracks] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setDiscoveryLoading(true);
    fetchSoundCloudDiscovery(12).then(tracks => {
      if (!cancelled) {
        setDiscoveryTracks(tracks);
        setDiscoveryLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };


  return (
    <div className="w-full h-full">
      <Navbar />

      <div className="px-6 pb-24 space-y-10">

        {/* ── Welcome header ── */}
        <div className="pt-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Discover what everyone's uploading</p>
        </div>

        {/* ── Recently Played (only if items exist) ── */}
        {recentlyPlayed && recentlyPlayed.length > 0 && (
          <section className="animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-4">Recently Played</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyPlayed.slice(0, 6).map((song) => (
                <RecentlyPlayedCard
                  key={song._id}
                  song={song}
                  isPlaying={track?._id === song._id && playStatus}
                  onPlayToggle={(s) => {
                    if (track?._id === s._id) {
                      if (playStatus) pause();
                      else play();
                    } else {
                      playTrack(s, recentlyPlayed);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Albums row (only if albums exist or loading) ── */}
        {(albumsLoading || albumsData.length > 0) && (
          <BorderGlow
            edgeSensitivity={25}
            glowColor="142 70 45"
            backgroundColor="transparent"
            borderRadius={20}
            glowRadius={32}
            glowIntensity={1.1}
            coneSpread={28}
            animated
            colors={['#1ED760', '#14a84a', '#0d7a36']}
            fillOpacity={0.3}
            className="w-full"
          >
            <section style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Albums</h2>
                </div>
              </div>

              {albumsLoading ? (
                <div className="flex gap-5 overflow-x-auto pb-3">
                  {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-3">
                  {albumsData.map(album => (
                    <AlbumItem key={album._id} album={album} />
                  ))}
                </div>
              )}
            </section>
          </BorderGlow>
        )}

        {/* ── iTunes Discover section ── */}
        <BorderGlow
          edgeSensitivity={25}
          glowColor="199 80 55"
          backgroundColor="transparent"
          borderRadius={20}
          glowRadius={32}
          glowIntensity={1.0}
          coneSpread={28}
          colors={['#38bdf8', '#818cf8', '#f472b6']}
          fillOpacity={0.25}
          className="w-full"
        >
          <section style={{ padding: '20px 24px' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">Discover</h2>
                {!discoveryLoading && discoveryTracks.length > 0 && (
                  <span className="text-xs text-gray-500 bg-white/[0.05] px-2 py-0.5 rounded-full capitalize ml-1">
                    SoundCloud Charts
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600">via SoundCloud · Full Streams</span>
            </div>

            {discoveryLoading ? (
              <div className="flex gap-5 overflow-x-auto pb-3">
                {[...Array(7)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-3">
                {discoveryTracks.map(item => (
                  <ExternalTrackCard
                    key={item._id}
                    track={item}
                    isPreviewPlaying={track?._id === item._id && playStatus}
                    onPreviewToggle={() => {
                      if (track?._id === item._id) {
                        if (playStatus) { pause(); } else { play(); }
                      } else {
                        playTrack(item, discoveryTracks);
                      }
                    }}
                    isLiked={likedSongIds.has(item._id)}
                    onLikeToggle={toggleLikeTrack}
                    playlists={playlists}
                    onAddToPlaylist={addTrackToPlaylist}
                  />
                ))}
              </div>
            )}
          </section>
        </BorderGlow>

        {/* ── All tracks feed ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">All Tracks</h2>
              {!songsLoading && songsData.length > 0 && (
                <span className="text-xs text-gray-500 bg-white/[0.05] px-2 py-0.5 rounded-full ml-1">
                  {songsData.length}
                </span>
              )}
            </div>
            {!songsLoading && songsData.length > 0 && (
              <button
                onClick={() => navigate('/profile/mine')}
                className="text-xs font-semibold text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-400/50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3 h-3" />
                Upload
              </button>
            )}
          </div>

          {songsLoading ? (
            <div className="space-y-1">
              {[...Array(8)].map((_, i) => <SongRowSkeleton key={i} />)}
            </div>
          ) : songsData.length === 0 ? (
            <EmptyFeed navigate={navigate} />
          ) : (
            <div className="space-y-0.5">
              {/* Table header */}
              <div className="flex items-center gap-4 px-3 pb-2 border-b border-white/[0.06] mb-1">
                <span className="w-5 text-center text-xs text-gray-600">#</span>
                <span className="w-11 flex-shrink-0" />
                <span className="flex-1 text-xs text-gray-500 uppercase tracking-wider font-semibold">Title</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold hidden md:block w-[120px]">Album</span>
                <span className="text-xs text-gray-500 w-10 text-right">⏱</span>
              </div>
              {songsData.map((song, i) => (
                <SongRow
                  key={song._id}
                  song={song}
                  index={i}
                  isPlaying={track?._id === song._id && playStatus}
                  onPlay={(s) => playTrack(s, songsData)}
                  isLiked={likedSongIds.has(song._id)}
                  onLikeToggle={toggleLikeTrack}
                  playlists={playlists}
                  onAddToPlaylist={addTrackToPlaylist}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default DisplayHome;