import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Album, 
  Play, 
  User, 
  TrendingUp, 
  Users, 
  Clock, 
  Heart,
  Plus,
  Upload,
  Search,
  Filter,
  Calendar,
  Download,
  Share2,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Headphones,
  Star,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const Dashboard = () => {
  const { 
    songsData, 
    albumsData, 
    songsLoading, 
    albumsLoading, 
    playWithId,
    track,
    playStatus 
  } = usePlayer();

  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [recentActivity] = useState([
    { 
      type: 'song', 
      action: 'added', 
      item: 'Midnight Dreams uploaded', 
      time: '2 minutes ago', 
      icon: Music,
      user: 'Admin'
    },
    { 
      type: 'album', 
      action: 'created', 
      item: 'Summer Hits 2024 created', 
      time: '1 hour ago', 
      icon: Album,
      user: 'Admin'
    },
    { 
      type: 'play', 
      action: 'trending', 
      item: 'Electric Nights reached 10K plays', 
      time: '3 hours ago', 
      icon: TrendingUp,
      user: 'System'
    },
    { 
      type: 'user', 
      action: 'joined', 
      item: 'New premium subscriber', 
      time: '5 hours ago', 
      icon: User,
      user: 'System'
    },
    { 
      type: 'song', 
      action: 'liked', 
      item: 'Ocean Waves added to 50+ playlists', 
      time: '8 hours ago', 
      icon: Heart,
      user: 'System'
    }
  ]);

  // Calculate dynamic stats
  const totalDuration = songsData.reduce((acc, song) => {
    const duration = song.duration || '0:00';
    const [minutes, seconds] = duration.split(':').map(Number);
    return acc + (minutes * 60) + (seconds || 0);
  }, 0);

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get most recent songs
  const recentSongs = songsData.slice(-5).reverse();

  // Get top albums (by song count)
  const albumSongCounts = albumsData.map(album => ({
    ...album,
    songCount: songsData.filter(song => song.album === album.name).length
  })).sort((a, b) => b.songCount - a.songCount);

  const topAlbums = albumSongCounts.slice(0, 3);

  // Mock analytics data
  const [analyticsData] = useState({
    plays: {
      today: 1247,
      week: 8643,
      month: 32451,
      change: +12.5
    },
    listeners: {
      today: 342,
      week: 2156,
      month: 8234,
      change: +8.2
    },
    revenue: {
      today: 156.78,
      week: 1234.56,
      month: 4567.89,
      change: +15.3
    }
  });

  const stats = [
    { 
      label: 'Total Songs', 
      value: songsData.length, 
      icon: Music, 
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      change: +5.2,
      subtitle: formatTotalDuration(totalDuration)
    },
    { 
      label: 'Total Albums', 
      value: albumsData.length, 
      icon: Album, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      change: +12.1,
      subtitle: `${songsData.length} songs`
    },
    { 
      label: 'Monthly Plays', 
      value: '32.5K', 
      icon: Play, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      change: analyticsData.plays.change,
      subtitle: '8.6K this week'
    },
    { 
      label: 'Active Listeners', 
      value: '8.2K', 
      icon: Headphones, 
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      change: analyticsData.listeners.change,
      subtitle: '342 today'
    }
  ];

  const quickActions = [
    {
      title: 'Add Song',
      description: 'Upload new music',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.location.href = '/admin/add-song'
    },
    {
      title: 'Create Album',
      description: 'New album collection',
      icon: Album,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.location.href = '/admin/add-album'
    },
    {
      title: 'View Analytics',
      description: 'Detailed insights',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Analytics coming soon')
    },
    {
      title: 'Manage Users',
      description: 'User management',
      icon: Users,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => console.log('User management coming soon')
    }
  ];

  if (songsLoading || albumsLoading) {
    return <LoadingSpinner text="Loading dashboard..." size="large" />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your music library.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const ChangeIcon = isPositive ? ArrowUp : stat.change < 0 ? ArrowDown : Minus;
          
          return (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 hover:scale-105 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : stat.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  <ChangeIcon className="w-4 h-4 mr-1" />
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-gray-500 text-sm mt-1">{stat.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Songs */}
        <div className="xl:col-span-2 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Songs</h3>
            <button 
              onClick={() => window.location.hash = '#/list-song'}
              className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {recentSongs.length > 0 ? recentSongs.map((song, index) => (
              <div 
                key={song._id} 
                className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer"
                onClick={() => playWithId(song._id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={song.image} 
                      alt={song.name}
                      className="w-12 h-12 rounded object-cover" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48/1f1f1f/ffffff?text=♪';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium group-hover:text-green-400 transition-colors">
                      {song.name}
                    </p>
                    <p className="text-gray-400 text-sm">{song.desc}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-gray-400 text-sm">{song.album}</span>
                  <span className="text-gray-400 text-sm">{song.duration || '0:00'}</span>
                  {track && track._id === song._id && playStatus && (
                    <div className="flex items-center text-green-400">
                      <Activity className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-12">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No songs uploaded yet</p>
                <p className="text-sm mt-1">Start by adding your first song</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.item}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                      <span className="text-gray-500 text-xs">{activity.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Albums and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Albums */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Albums</h3>
            <button 
              onClick={() => window.location.hash = '#/list-album'}
              className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {topAlbums.length > 0 ? topAlbums.map((album, index) => (
              <div key={album._id} className="flex items-center space-x-4 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <img 
                    src={album.image} 
                    alt={album.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48/1f1f1f/ffffff?text=♪';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{album.name}</p>
                  <p className="text-gray-400 text-sm">
                    {album.songCount} song{album.songCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: album.bgColour }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-8">
                <Album className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No albums created yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Performance Overview</h3>
          
          <div className="space-y-6">
            {/* Listening Stats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Listening Time</span>
                <span className="text-white font-medium">{formatTotalDuration(totalDuration * 45)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            {/* Popular Genres */}
            <div>
              <p className="text-gray-400 text-sm mb-3">Popular Content</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Songs</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-700 rounded-full h-1.5 mr-3">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-gray-400 text-xs">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Albums</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-700 rounded-full h-1.5 mr-3">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    <span className="text-gray-400 text-xs">62%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Growth This Month</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">+{analyticsData.plays.change}%</div>
              <p className="text-green-400 text-sm">Above average performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 group`}
              >
                <Icon className="w-6 h-6 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-90 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">System Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-white font-medium">Server Status</p>
            <p className="text-green-400 text-sm">All systems operational</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-white font-medium">Upload Status</p>
            <p className="text-blue-400 text-sm">Ready for new content</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-white font-medium">Maintenance</p>
            <p className="text-purple-400 text-sm">Next: Sunday 2AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;