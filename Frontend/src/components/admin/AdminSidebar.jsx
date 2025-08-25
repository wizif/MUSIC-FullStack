import React from 'react';
import { Home, Plus, Album, Music, List, Settings } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-song', label: 'Add Song', icon: Plus },
    { id: 'add-album', label: 'Add Album', icon: Album },
    { id: 'list-songs', label: 'All Songs', icon: Music },
    { id: 'list-albums', label: 'All Albums', icon: List },
    { id: 'analytics', label: 'Analytics', icon: Settings },
  ];

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Music className="mr-3 text-green-500" />
          Spotify Admin
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your music library</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${
                  activeTab === item.id ? 'text-green-500' : ''
                }`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <p>Spotify Admin Panel v1.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;