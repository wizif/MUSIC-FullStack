// Enhanced DisplayHome.jsx
import React, { useState, useCallback } from 'react';
import { Play, TrendingUp, Clock, Star } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Navbar from '../../components/user/Navbar.jsx';
import AlbumItem from '../../components/shared/AlbumItem.jsx';
import SongItem from '../../components/shared/SongItem.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const DisplayHome = () => {
  const { songsData, albumsData, songsLoading, albumsLoading, playWithId, error } = usePlayer();
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = useCallback((e, songId) => {
    if (!imageErrors.has(songId)) {
      setImageErrors(prev => new Set([...prev, songId]));
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+4pmqPC90ZXh0Pjwvc3ZnPg==';
    }
  }, [imageErrors]);

  if (error) {
    return (
      <div className="w-full h-full">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400 text-lg mb-4">Error loading content</p>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title, subtitle, icon: Icon, showViewAll = false }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-6 h-6 text-green-500" />}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      </div>
      {showViewAll && (
        <button className="text-green-500 hover:text-green-400 font-medium text-sm transition-colors">
          Show all
        </button>
      )}
    </div>
  );

  const LoadingGrid = ({ count = 6, type = 'album' }) => (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-48 animate-pulse">
          <div className="bg-gray-700 aspect-square rounded-lg mb-3"></div>
          <div className="bg-gray-700 h-4 rounded mb-2"></div>
          <div className="bg-gray-700 h-3 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );

  const RecentlyPlayedCard = ({ song, onClick }) => (
    <div 
      onClick={onClick}
      className="flex items-center bg-[#ffffff08] hover:bg-[#ffffff15] rounded-lg p-3 cursor-pointer transition-all duration-300 group w-full backdrop-blur-sm border border-gray-800/30 hover:border-gray-700/50"
    >
      <img 
        src={song.image} 
        alt={song.name}
        className="w-12 h-12 rounded-md object-cover mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-105" 
        onError={(e) => handleImageError(e, song._id)}
      />
      <span className="text-white font-medium truncate flex-1 min-w-0" title={song.name}>
        {song.name}
      </span>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 transform translate-x-2 group-hover:translate-x-0">
        <div className="bg-green-500 hover:bg-green-400 rounded-full p-2 shadow-lg">
          <Play className="w-4 h-4 text-black fill-black" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <Navbar />
      
      <div className="px-6 pb-6 w-full space-y-8">
        {/* Good Morning/Evening Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {new Date().getHours() < 12 ? 'Good morning' : 
             new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
          </h1>
          <p className="text-gray-400">Let's play some music</p>
        </div>

        {/* Featured Charts */}
        <section className="mb-12 w-full">
          <SectionHeader 
            title="Featured Charts" 
            subtitle="Trending albums this week"
            icon={TrendingUp}
            showViewAll={true}
          />
          {albumsLoading ? (
            <LoadingGrid count={6} type="album" />
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide w-full">
              {albumsData.length > 0 ? (
                albumsData.map((album) => (
                  <AlbumItem 
                    key={album._id} 
                    album={album}
                  />
                ))
              ) : (
                <div className="text-gray-400 py-12 px-6 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-center">No albums available</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recently played */}
        <section className="mb-12 w-full">
          <SectionHeader 
            title="Recently played" 
            subtitle="Jump back in"
            icon={Clock}
          />
          {songsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center bg-gray-700 rounded-lg p-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-600 rounded mr-4"></div>
                  <div className="h-4 bg-gray-600 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
              {songsData.length > 0 ? (
                songsData.slice(0, 10).map((song) => (
                  <RecentlyPlayedCard
                    key={song._id}
                    song={song}
                    onClick={() => playWithId(song._id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-gray-400 py-12 text-center w-full bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p>No songs available</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Today's biggest hits */}
        <section className="mb-12 w-full">
          <SectionHeader 
            title="Today's biggest hits" 
            subtitle="Most popular right now"
            icon={Star}
            showViewAll={true}
          />
          {songsLoading ? (
            <LoadingGrid count={6} type="song" />
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide w-full">
              {songsData.length > 0 ? (
                songsData.map((song) => (
                  <SongItem 
                    key={song._id} 
                    song={song}
                  />
                ))
              ) : (
                <div className="text-gray-400 py-12 px-6 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-center">No songs available</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Made for you */}
        {songsData.length > 0 && (
          <section className="mb-12 w-full">
            <SectionHeader 
              title="Made for you" 
              subtitle="Based on your recent listening"
            />
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide w-full">
              {songsData.slice(0, 10).map((song) => (
                <SongItem 
                  key={`made-for-you-${song._id}`} 
                  song={song}
                />
              ))}
            </div>
          </section>
        )}

        {/* Jump back in */}
        {albumsData.length > 0 && (
          <section className="mb-12 w-full">
            <SectionHeader 
              title="Jump back in" 
              subtitle="Pick up where you left off"
            />
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide w-full">
              {albumsData.slice(0, 8).map((album) => (
                <AlbumItem 
                  key={`jump-back-${album._id}`} 
                  album={album}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DisplayHome;