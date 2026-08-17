import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, 
  Album, 
  Play, 
  User, 
  Users, 
  Plus, 
  Calendar,
  Activity,
  ShieldAlert,
  ChevronRight,
  Disc
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import api from '../../utils/api.js';
import BorderGlow from '../../components/shared/BorderGlow.jsx';
import GlitchText from '../../components/shared/GlitchText.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    songsData, 
    albumsData, 
    songsLoading, 
    albumsLoading, 
    playTrack,
    track,
    playStatus 
  } = usePlayer();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      setUsersLoading(true);
      try {
        const response = await api.get('/api/admin/users');
        if (response.data && response.data.success) {
          setUsers(response.data.users);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setUsersError(err.response?.data?.message || err.message);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (songsLoading || albumsLoading || usersLoading) {
    return <LoadingSpinner text="Loading admin analytics..." size="large" />;
  }

  // Calculate real analytics from DB
  const standardUsers = users.filter(u => u.role === 'user');
  const admins = users.filter(u => u.role === 'admin');
  const superadmins = users.filter(u => u.role === 'superadmin');

  // Gather real user upload activity
  const userUploads = [];
  users.forEach(u => {
    if (u.role === 'user' && u.songs && u.songs.length > 0) {
      u.songs.forEach(song => {
        userUploads.push({
          ...song,
          uploaderName: u.name,
          uploaderEmail: u.email,
          uploaderId: u._id
        });
      });
    }
  });

  // Limit to most recent uploads (since listUsersForAdmin sorts users by createdAt desc, userUploads will naturally be fresh)
  const recentUserUploads = userUploads.slice(0, 5);
  const recentUserRegistrations = standardUsers.slice(0, 5);

  const stats = [
    { 
      label: 'Standard Users', 
      value: standardUsers.length, 
      icon: Users, 
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      subtitle: `${admins.length} Admins registered`
    },
    { 
      label: 'Total Songs', 
      value: songsData.length, 
      icon: Music, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      subtitle: `${userUploads.length} user-uploaded tracks`
    },
    { 
      label: 'Total Albums', 
      value: albumsData.length, 
      icon: Album, 
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      subtitle: 'Organized collections'
    },
    { 
      label: 'Super Admin Access', 
      value: superadmins.length, 
      icon: ShieldAlert, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      subtitle: 'Root controllers'
    }
  ];

  return (
    <div className="space-y-6 pb-8 text-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-8 h-8 text-green-500" />
          <GlitchText speed={0.8} enableShadows={true} enableOnHover={true}>
            Admin Overview Dashboard
          </GlitchText>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Real-time system statistics and member publishing activities.</p>
      </div>

      {usersError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold">
          Error loading directory data: {usersError}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          // Map each card's accent to BorderGlow theme
          const glowThemes = [
            { glowColor: '142 70 45', colors: ['#1ED760', '#14a84a', '#0d7a36'] }, // green
            { glowColor: '217 80 55', colors: ['#38bdf8', '#60a5fa', '#818cf8'] }, // blue
            { glowColor: '43 80 55',  colors: ['#fbbf24', '#f59e0b', '#d97706'] }, // amber
            { glowColor: '270 70 50', colors: ['#c084fc', '#a855f7', '#9333ea'] }, // purple
          ];
          const theme = glowThemes[index] || glowThemes[0];
          return (
            <BorderGlow
              key={index}
              edgeSensitivity={28}
              glowColor={theme.glowColor}
              backgroundColor="#18181f"
              borderRadius={16}
              glowRadius={28}
              glowIntensity={1.0}
              coneSpread={26}
              animated
              colors={theme.colors}
              fillOpacity={0.25}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-white mt-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-gray-500 text-xs mt-1.5 font-medium">{stat.subtitle}</p>
                  )}
                </div>
              </div>
            </BorderGlow>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* User uploads */}
        <div className="xl:col-span-2 bg-[#18181f] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Disc className="w-5 h-5 text-blue-400 animate-pulse" />
                  Recent User Uploads
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Songs published recently by community members.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/list-songs')}
                className="text-green-500 hover:text-green-400 text-xs font-bold transition-colors flex items-center gap-0.5"
              >
                View all songs
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {recentUserUploads.length > 0 ? recentUserUploads.map((song) => (
                <div 
                  key={song._id} 
                  className="flex items-center justify-between p-3 bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.02] rounded-xl transition-all duration-200 group cursor-pointer"
                  onClick={() => playTrack(song, recentUserUploads)}
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={song.image} 
                        alt={song.name}
                        className="w-12 h-12 rounded-lg object-cover" 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x48/1f1f1f/ffffff?text=♪';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate group-hover:text-green-400 transition-colors">
                        {song.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate mt-0.5">
                        Uploaded by <span className="text-blue-400 font-medium">{song.uploaderName}</span> ({song.uploaderEmail})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className="text-gray-500 text-xs hidden md:inline">{song.album}</span>
                    <span className="text-gray-400 text-xs font-medium bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.03]">
                      {song.duration || '0:00'}
                    </span>
                    {track && track._id === song._id && playStatus && (
                      <div className="flex items-center text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-400 py-12">
                  <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No song uploads found</p>
                  <p className="text-xs text-gray-500 mt-0.5">Community uploaded songs will be tracked here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User activity joins */}
        <div className="bg-[#18181f] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Recent User Registrations
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Latest community signups.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/users')}
                className="text-green-500 hover:text-green-400 text-xs font-bold transition-colors flex items-center gap-0.5"
              >
                Manage Users
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentUserRegistrations.length > 0 ? recentUserRegistrations.map((userItem) => (
                <div key={userItem._id} className="flex items-center space-x-3 p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] rounded-xl transition-all duration-200">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center font-bold text-green-400 text-sm flex-shrink-0">
                    {userItem.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate">{userItem.name}</p>
                    <p className="text-gray-400 text-[11px] truncate">{userItem.email}</p>
                    <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(userItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {userItem.songCount} {userItem.songCount === 1 ? 'song' : 'songs'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-400 py-12">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No registered users</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#18181f] border border-white/[0.04] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Library Operations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/add-song')}
            className="flex items-center gap-4 p-4 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/10"
          >
            <div className="p-2 bg-black/10 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Add Song</p>
              <p className="text-[11px] opacity-75 font-semibold">Upload track to the library</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/admin/add-album')}
            className="flex items-center gap-4 p-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/10"
          >
            <div className="p-2 bg-black/10 rounded-lg">
              <Album className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Create Album</p>
              <p className="text-[11px] opacity-75 font-semibold">Create a new collection</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-4 p-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/10"
          >
            <div className="p-2 bg-black/10 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Manage Users</p>
              <p className="text-[11px] opacity-75 font-semibold">Review accounts and status</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;