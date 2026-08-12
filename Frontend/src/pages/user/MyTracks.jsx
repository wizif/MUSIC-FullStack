import React, { useState, useEffect, useRef } from 'react';
import { Upload, Music, Image, Plus, X, Trash2, CheckCircle, AlertCircle, Sparkles, BarChart2, ShieldAlert } from 'lucide-react';
import { songAPI, validateFile } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePlayer } from '../../context/PlayerContext.jsx';
import SongItem from '../../components/shared/SongItem.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const MyTracks = () => {
  const { user } = useAuth();
  const { playWithId, loadSongs, albumsData } = usePlayer();
  
  const [mySongs, setMySongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    album: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const fetchMySongs = async () => {
    setLoadingSongs(true);
    try {
      const data = await songAPI.getMine();
      if (data.success) {
        setMySongs(data.songs);
      }
    } catch (err) {
      console.error('Error fetching own songs:', err);
      setErrorMsg(err.message || 'Failed to load your tracks.');
    } finally {
      setLoadingSongs(false);
    }
  };

  useEffect(() => {
    fetchMySongs();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateFile(file, 'audio');
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateFile(file, 'image');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mySongs.length >= 10) {
        throw new Error('Upload limit reached: max 10 tracks per account.');
      }
      if (!formData.name.trim()) throw new Error('Song title is required');
      if (!formData.desc.trim()) throw new Error('Artist/description is required');
      if (!audioFile) throw new Error('Audio file is required');
      if (!imageFile) throw new Error('Cover artwork is required');

      const songData = {
        name: formData.name.trim(),
        desc: formData.desc.trim(),
        album: formData.album.trim(),
        audioFile,
        imageFile
      };

      const res = await songAPI.add(songData);
      
      if (res.success) {
        setSuccessMsg('Track uploaded successfully!');
        
        // Reset form
        setFormData({ name: '', desc: '', album: '' });
        setAudioFile(null);
        setImageFile(null);
        setAudioPreview(null);
        setImagePreview(null);
        if (audioInputRef.current) audioInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';

        // Reload data
        await fetchMySongs();
        await loadSongs(); // Reload global feed player lists

        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (songId, e) => {
    e.stopPropagation(); // Prevent playing track on delete click
    if (!window.confirm('Are you sure you want to delete this track?')) return;

    try {
      const res = await songAPI.remove(songId);
      if (res.success) {
        setSuccessMsg('Track deleted successfully.');
        await fetchMySongs();
        await loadSongs();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error(res.message || 'Failed to delete track.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    setAudioPreview(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const removeImageFile = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const limitPercentage = Math.min((mySongs.length / 10) * 100, 100);
  const isLimitReached = mySongs.length >= 10;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#121212] min-h-screen text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-900 to-black p-6 rounded-3xl border border-white/[0.05] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#1ED760]" />
            <span className="text-xs font-bold tracking-widest text-[#1ED760] uppercase">Creator Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Tracks</h1>
          <p className="text-gray-400 text-sm mt-0.5 font-medium">Manage and upload your own tracks</p>
        </div>

        {/* Upload Limit Progress Tracker */}
        <div className="w-full md:w-72 bg-black/40 border border-white/[0.08] p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-400 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-green-500" />
              Upload Capacity
            </span>
            <span className="font-bold text-white">{mySongs.length} / 10 tracks used</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isLimitReached 
                  ? 'bg-rose-500' 
                  : mySongs.length >= 8 
                  ? 'bg-amber-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${limitPercentage}%` }}
            />
          </div>
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

      {/* Main Grid: Upload & Tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Upload form or limit message */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#18181F] to-[#121216] border border-white/[0.06] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/[0.06] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1ED760]" />
              Upload a Track
            </h2>
            <p className="text-xs text-gray-400 mt-1">Add a new track to your public library</p>
          </div>

          {isLimitReached ? (
            /* Limit Reached Warning - Hides the Form */
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
              <div>
                <h3 className="font-bold text-white text-lg">Upload Limit Reached</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  You've hit the 10-track limit — remove a track to upload a new one.
                </p>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Song Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Song Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  className="w-full p-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-500/10 rounded-2xl text-white placeholder-gray-500 text-sm transition-all duration-300"
                  disabled={uploading}
                  required
                />
              </div>

              {/* Song Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Artist / Description *
                </label>
                <input
                  type="text"
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Artist or tags"
                  className="w-full p-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-500/10 rounded-2xl text-white placeholder-gray-500 text-sm transition-all duration-300"
                  disabled={uploading}
                  required
                />
              </div>

              {/* Album Selection (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Album (Optional)
                </label>
                <select
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-500/10 rounded-2xl text-white focus:bg-gray-900 text-sm transition-all duration-300"
                  disabled={uploading}
                >
                  <option value="">None (Single)</option>
                  {albumsData.map((album) => (
                    <option key={album._id} value={album.name}>
                      {album.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Artwork Image Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Artwork / Cover Art *
                </label>
                {!imageFile ? (
                  <div
                    onClick={() => !uploading && imageInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.08] hover:border-green-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group bg-black/20"
                  >
                    <Image className="w-10 h-10 text-gray-500 mx-auto mb-2 group-hover:text-green-400 group-hover:scale-110 transition-all" />
                    <p className="text-xs text-gray-400 font-medium group-hover:text-white">Click to upload artwork image</p>
                    <p className="text-[10px] text-gray-500 mt-1">JPEG, PNG, WEBP (max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden aspect-video max-h-32 bg-black border border-white/[0.08]">
                    <img src={imagePreview} alt="Artwork preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImageFile}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Audio File Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Audio File *
                </label>
                {!audioFile ? (
                  <div
                    onClick={() => !uploading && audioInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.08] hover:border-green-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group bg-black/20"
                  >
                    <Music className="w-10 h-10 text-gray-500 mx-auto mb-2 group-hover:text-green-400 group-hover:scale-110 transition-all" />
                    <p className="text-xs text-gray-400 font-medium group-hover:text-white">Click to upload track audio</p>
                    <p className="text-[10px] text-gray-500 mt-1">MP3, WAV, FLAC (max 10MB)</p>
                  </div>
                ) : (
                  <div className="bg-black/30 border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <Music className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate pr-2">{audioFile.name}</p>
                        <p className="text-[10px] text-gray-500">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAudioFile}
                      className="text-rose-400 hover:text-rose-300 p-1.5 rounded-full hover:bg-rose-500/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Audio Preview if selected */}
              {audioPreview && (
                <div className="pt-2">
                  <audio 
                    controls 
                    src={audioPreview} 
                    className="w-full scale-90 border border-white/[0.05] rounded-lg"
                    style={{ filter: 'invert(1) hue-rotate(180deg)' }} 
                  />
                </div>
              )}

              {/* Submit Upload */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold py-2.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center text-sm"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="small" className="text-black" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Track</span>
                  </div>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Uploaded songs list displaying via SongItem where it makes sense */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#18181F] to-[#121216] border border-white/[0.06] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/[0.06] pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-green-400" />
                Published Tracks
              </h2>
              <p className="text-xs text-gray-400 mt-1">Tracks currently active in library</p>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-black/40 border border-white/[0.05] px-3 py-1 rounded-full">
              {mySongs.length} Tracks
            </span>
          </div>

          {/* Loading songs */}
          {loadingSongs ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3">
              <LoadingSpinner size="large" />
              <span className="text-sm">Fetching tracks...</span>
            </div>
          ) : mySongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 space-y-4">
              <div className="p-4 rounded-full bg-white/[0.02] border border-white/[0.05]">
                <Music className="w-10 h-10 opacity-30" />
              </div>
              <div>
                <p className="font-semibold text-white">No tracks uploaded yet</p>
                <p className="text-xs mt-1 max-w-xs mx-auto">Upload your first audio track using the form on the left to share it with everyone!</p>
              </div>
            </div>
          ) : (
            /* grid displaying SongItem cards with delete buttons */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-1">
              {mySongs.map((song) => (
                <div key={song._id} className="relative group/card bg-black/20 hover:bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] rounded-2xl p-2 transition-all duration-300 flex flex-col justify-between">
                  <SongItem song={song} className="hover:bg-transparent p-1" />
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(song._id, e)}
                    className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-rose-600/90 text-gray-400 hover:text-white rounded-xl transition-all duration-200 opacity-0 group-hover/card:opacity-100 shadow-md backdrop-blur-sm"
                    title="Delete track"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyTracks;
