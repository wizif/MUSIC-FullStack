import React, { useState, useEffect } from 'react';
import { Shield, Users, Mail, Calendar, UserCheck, UserX, AlertCircle, CheckCircle, Search, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants.js';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import Scanner from '../../components/shared/Scanner.jsx';
import GlitchText from '../../components/shared/GlitchText.jsx';

const SuperadminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sa-7f3k2x/users`, {
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

  const handleUpdateRole = async (userId, targetRole) => {
    setActionLoadingId(userId);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/sa-7f3k2x/set-role`,
        { userId, role: targetRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sc_token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMsg(response.data.message || `User role updated successfully.`);
        await fetchUsers(); // Refresh the list
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        throw new Error(response.data.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update user role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter users based on query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#08080C]/40 backdrop-blur-md text-white p-6 md:p-12 overflow-hidden font-sans select-none">
      {/* Background Scanner Visual */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <Scanner
          color1="#A855F7"
          color2="#3B82F6"
          color3="#FFFFFF"
          speed={0.5}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1.0}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline={true}
          grain={true}
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction={true}
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>

      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/0 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/0 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Panel Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#12121A]/60 backdrop-blur-md p-6 rounded-3xl border border-white/[0.08] shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">Super Admin Panel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              <GlitchText speed={0.8} enableShadows={true} enableOnHover={true}>
                Access Control & Role Registry
              </GlitchText>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage administrative access keys and promote or demote platform managers.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500/10 rounded-xl text-white placeholder-gray-500 text-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{errorMsg}</span>
          </div>
        )}

        {/* User list cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 space-y-3">
            <LoadingSpinner size="large" />
            <span className="text-sm">Fetching user roles directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-[#12121A]/30 border border-white/[0.06] rounded-3xl">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-40" />
            <p className="text-gray-400 font-medium">No users found matching query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((userItem) => (
              <div 
                key={userItem._id}
                className="bg-[#12121A]/40 border border-white/[0.06] rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center border border-white/[0.05] font-bold text-purple-400 text-lg">
                    {userItem.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-white text-base truncate flex items-center gap-2">
                      {userItem.name}
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        userItem.role === 'superadmin' 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                          : userItem.role === 'admin' 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-green-500/10 border-green-500/30 text-green-400'
                      }`}>
                        {userItem.role}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      {userItem.email}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      Joined {new Date(userItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-gray-500">
                    {userItem.songCount || 0} published tracks
                  </span>

                  {/* Actions buttons */}
                  {userItem.role === 'superadmin' ? (
                    <span className="text-xs text-purple-400 font-bold flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Root Account
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      {userItem.role === 'admin' ? (
                        <button
                          onClick={() => handleUpdateRole(userItem._id, 'user')}
                          disabled={actionLoadingId !== null}
                          className="bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 hover:border-transparent text-rose-400 hover:text-black font-bold py-1.5 px-4 rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Demote to User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateRole(userItem._id, 'admin')}
                          disabled={actionLoadingId !== null}
                          className="bg-green-500/10 hover:bg-[#1ED760] border border-green-500/30 hover:border-transparent text-green-400 hover:text-black font-bold py-1.5 px-4 rounded-xl text-xs transition-all duration-300 flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Make Admin
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperadminPanel;
