import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Download } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (e, itemId) => {
    // Prevent infinite loop by tracking which images have already failed
    if (!imageErrors.has(itemId)) {
      setImageErrors(prev => new Set([...prev, itemId]));
      // Use a data URL instead of external placeholder service
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMWYxZjFmIi8+CjxwYXRoIGQ9Ik0yNCAzNkMyNy4zMTM3IDM2IDMwIDMzLjMxMzcgMzAgMzBDMzAgMjYuNjg2MyAyNy4zMTM3IDI0IDI0IDI0QzIwLjY4NjMgMjQgMTggMjYuNjg2MyAxOCAzMEMxOCAzMy4zMTM3IDIwLjY4NjMgMzYgMjQgMzZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQgMTJDMjUuMTA0NiAxMiAyNiAxMi44OTU0IDI2IDE0VjIyQzI2IDIzLjEwNDYgMjUuMTA0NiAyNCAyNCAyNEMyMi44OTU0IDI0IDIyIDIzLjEwNDYgMjIgMjJWMTRDMjIgMTIuODk1NCAyMi44OTU0IDEyIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
    }
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
          <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-2 hover:bg-[#1a1a1a] rounded-full">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-full transition-colors">
              Playlists
            </button>
            <button className="px-3 py-1.5 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm rounded-full transition-colors">
              Artists
            </button>
          </div>
        </div>
        
        {/* Library Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2 min-h-0">
          {/* Liked Songs */}
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[15px] font-medium">Liked Songs</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-400 text-[13px]">Playlist • 0 songs</p>
              </div>
            </div>
          </div>

          {/* Downloaded */}
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
            <div className="w-12 h-12 bg-[#0d7927] rounded flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[15px] font-medium">Downloaded</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-400 text-[13px]">0 songs</p>
              </div>
            </div>
          </div>

          {/* Sample Recently Played */}
          {[
            { 
              id: "daily-mix-1",
              name: "Daily Mix 1", 
              type: "Made for you", 
              image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face",
              isDownloaded: true
            },
            { 
              id: "discover-weekly",
              name: "Discover Weekly", 
              type: "Made for you", 
              image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop&crop=face",
              isDownloaded: false
            },
            { 
              id: "release-radar",
              name: "Release Radar", 
              type: "Made for you", 
              image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=face",
              isDownloaded: true
            },
            { 
              id: "top-songs-2024",
              name: "Your Top Songs 2024", 
              type: "Made for you", 
              image: "https://images.unsplash.com/photo-1487180144351-b8954e07c9b0?w=100&h=100&fit=crop&crop=face",
              isDownloaded: false
            }
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
              <img 
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
                onError={(e) => handleImageError(e, item.id)}
              />
              <div className="min-w-0 flex-1">
                <p className="text-white text-[15px] font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  {item.isDownloaded && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                  <p className="text-gray-400 text-[13px] truncate">{item.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;