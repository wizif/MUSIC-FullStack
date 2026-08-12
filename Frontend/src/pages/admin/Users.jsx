import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar, Music, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Search, ShieldAlert } from 'lucide-react';
import { songAPI } from '../../utils/api.js';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sc_token')}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleUser = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(userId);
    }
  };

  const handleDeleteSong = async (songId, userName) => {
    if (!window.confirm(`Are you sure you want to remove this track from ${userName}?`)) return;

    try {
      const res = await songAPI.remove(songId);
      if (res.success) {
        setSuccessMsg('Track removed successfully.');
        await fetchUsers(); // Refresh the users list and count
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error(res.message || 'Failed to delete track.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Filter users based on name, email, or role
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/40 p-6 rounded-2xl border border-white/[0.05] shadow-md">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Users className="w-8 h-8 text-[#1ED760]" />
            Monitor Users
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Overview of registered users, their uploaded songs, and content moderation tools.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-[#1ED760]/60 focus:outline-none focus:ring-2 focus:ring-[#1ED760]/10 rounded-xl text-white placeholder-gray-500 text-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Users List Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500 space-y-3">
          <LoadingSpinner size="large" />
          <span className="text-sm">Loading users registry...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/10 border border-white/[0.04] rounded-2xl">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-40" />
          <p className="text-gray-400 font-medium">No users found</p>
          <p className="text-xs text-gray-500 mt-1">Try refining your search query</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((userItem) => (
            <div 
              key={userItem._id}
              className={`bg-[#18181F] border rounded-2xl transition-all duration-300 ${
                expandedUserId === userItem._id 
                  ? 'border-[#1ED760]/30 shadow-lg shadow-[#1ED760]/5' 
                  : 'border-white/[0.05] hover:border-white/[0.15]'
              }`}
            >
              {/* User row header summary */}
              <div 
                onClick={() => handleToggleUser(userItem._id)}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  {/* User Avatar Circle */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center border border-white/[0.05] font-bold text-[#1ED760] text-lg">
                    {userItem.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      {userItem.name}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        userItem.role === 'superadmin' 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                          : userItem.role === 'admin' 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-green-500/10 border-green-500/30 text-green-400'
                      }`}>
                        {userItem.role}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {userItem.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {new Date(userItem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between border-t border-white/[0.04] md:border-0 pt-3 md:pt-0">
                  <div className="flex items-center gap-2 bg-black/35 px-4 py-2 rounded-xl border border-white/[0.05]">
                    <Music className="w-4 h-4 text-[#1ED760]" />
                    <span className="text-sm font-semibold">{userItem.songCount || 0} tracks</span>
                  </div>
                  
                  <div>
                    {expandedUserId === userItem._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable uploaded songs details */}
              {expandedUserId === userItem._id && (
                <div className="px-5 pb-5 pt-1 border-t border-white/[0.05] bg-black/20 rounded-b-2xl space-y-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    User Tracks Monitor
                  </div>
                  
                  {!userItem.songs || userItem.songs.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs">
                      This user has not uploaded any tracks yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userItem.songs.map((song) => (
                        <div 
                          key={song._id}
                          className="flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 border border-white/[0.04] hover:border-white/[0.08] rounded-xl transition-all duration-200"
                        >
                          <div className="flex items-center min-w-0 gap-3">
                            <img 
                              src={song.image} 
                              alt={song.name} 
                              className="w-10 h-10 object-cover rounded-lg border border-white/[0.05]"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMxZjFmMWYiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudGVyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+4pmqPC90ZXh0Pjwvc3ZnPg==';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white text-sm truncate">{song.name}</p>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{song.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {song.duration && (
                              <span className="text-xs text-gray-500 font-semibold">{song.duration}</span>
                            )}
                            <button
                              onClick={() => handleDeleteSong(song._id, userItem.name)}
                              className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                              title="Delete this track"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
