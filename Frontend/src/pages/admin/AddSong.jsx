import React, { useState, useRef } from 'react';
import { Upload, Music, Image, Plus, X, CheckCircle, Disc3 } from 'lucide-react';
import { songAPI, albumAPI, validateFile } from '../../utils/api.js';
import { usePlayer } from '../../context/PlayerContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const AddSong = () => {
  const { albumsData, loadSongs } = usePlayer();
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    album: '',
  });
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // ── Inline album creation ──────────────────────────────
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumImg, setNewAlbumImg] = useState(null);
  const [newAlbumImgPreview, setNewAlbumImgPreview] = useState(null);
  const [newAlbumError, setNewAlbumError] = useState('');
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const newAlbumImgRef = useRef(null);

  const handleNewAlbumImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { validateFile(file, 'image'); setNewAlbumImg(file); setNewAlbumImgPreview(URL.createObjectURL(file)); setNewAlbumError(''); }
    catch (err) { setNewAlbumError(err.message); }
  };

  const handleCreateAlbumInline = async () => {
    if (!newAlbumName.trim()) { setNewAlbumError('Album name required'); return; }
    if (!newAlbumImg) { setNewAlbumError('Cover art required'); return; }
    setCreatingAlbum(true); setNewAlbumError('');
    try {
      const res = await albumAPI.add({ name: newAlbumName.trim(), desc: '', bgColour: '#121212', imageFile: newAlbumImg });
      if (!res.success) throw new Error(res.message || 'Failed');
      await loadSongs();
      setFormData(prev => ({ ...prev, album: newAlbumName.trim() }));
      setShowNewAlbum(false);
      setNewAlbumName(''); setNewAlbumImg(null); setNewAlbumImgPreview(null);
      if (newAlbumImgRef.current) newAlbumImgRef.current.value = '';
    } catch (err) {
      setNewAlbumError(err.message || 'Failed to create album');
    } finally {
      setCreatingAlbum(false);
    }
  };
  // ──────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file, 'audio');
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file, 'image');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validation
      if (!formData.name.trim()) throw new Error('Song name is required');
      if (!formData.desc.trim()) throw new Error('Song description is required');
      if (!audioFile) throw new Error('Audio file is required');
      if (!imageFile) throw new Error('Image file is required');

      const songData = {
        ...formData,
        audioFile,
        imageFile,
      };

      const response = await songAPI.add(songData);
      
      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({ name: '', desc: '', album: '' });
        setAudioFile(null);
        setImageFile(null);
        setAudioPreview(null);
        setImagePreview(null);
        
        // Clear file inputs
        if (audioInputRef.current) audioInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
        
        // Reload songs data
        await loadSongs();
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response.message || 'Failed to add song');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add New Song</h1>
        <p className="text-gray-400">Upload a new song to your music library</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-green-400">Song added successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Song Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                Song Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter song name"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Song Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Artist/Description *
              </label>
              <input
                type="text"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                placeholder="Enter artist name or description"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Album Selection with inline create */}
            <div>
              <label className="block text-white font-medium mb-2">
                Album
              </label>
              <select
                name="album"
                value={showNewAlbum ? '__new__' : formData.album}
                onChange={(e) => {
                  if (e.target.value === '__new__') { setShowNewAlbum(true); setNewAlbumError(''); }
                  else { setShowNewAlbum(false); handleInputChange(e); }
                }}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading || creatingAlbum}
              >
                <option value="">None (Single)</option>
                {albumsData.map((album) => (
                  <option key={album._id} value={album.name}>
                    {album.name}
                  </option>
                ))}
                <option value="__new__">＋ Create new album…</option>
              </select>

              {/* Inline album creator */}
              {showNewAlbum && (
                <div className="mt-3 p-4 bg-black/30 border border-green-500/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Disc3 className="w-4 h-4 text-green-400" />
                    <p className="text-xs font-bold text-green-400 uppercase tracking-wider">New Album</p>
                  </div>
                  {newAlbumError && <p className="text-red-400 text-xs">{newAlbumError}</p>}

                  <input type="text" placeholder="Album name *" value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:ring-1 focus:ring-green-500"
                    disabled={creatingAlbum} />

                  {!newAlbumImgPreview ? (
                    <div onClick={() => !creatingAlbum && newAlbumImgRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 hover:border-green-500 rounded-lg p-4 text-center cursor-pointer transition-colors group">
                      <Image className="w-6 h-6 text-gray-400 mx-auto mb-1 group-hover:text-green-500" />
                      <p className="text-xs text-gray-400 group-hover:text-white">Upload cover art *</p>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden" style={{ height: 80 }}>
                      <img src={newAlbumImgPreview} alt="cover" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={() => { setNewAlbumImg(null); setNewAlbumImgPreview(null); if (newAlbumImgRef.current) newAlbumImgRef.current.value = ''; }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input ref={newAlbumImgRef} type="file" accept="image/*" onChange={handleNewAlbumImg} className="hidden" />

                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => { setShowNewAlbum(false); setNewAlbumName(''); setNewAlbumImg(null); setNewAlbumImgPreview(null); setFormData(prev => ({ ...prev, album: '' })); }}
                      className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-white rounded-lg border border-gray-600 transition-colors"
                      disabled={creatingAlbum}>Cancel</button>
                    <button type="button" onClick={handleCreateAlbumInline}
                      className="flex-1 py-2 text-xs font-bold bg-green-500 hover:bg-green-400 text-black rounded-lg transition-colors"
                      disabled={creatingAlbum}>
                      {creatingAlbum ? 'Creating…' : 'Create Album'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-white font-medium mb-2">
                Audio File *
              </label>
              {!audioFile ? (
                <div
                  onClick={() => audioInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors group"
                >
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-green-500" />
                  <p className="text-gray-400 group-hover:text-white">
                    Click to upload audio file
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    MP3, WAV, FLAC (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="w-6 h-6 text-green-500 mr-3" />
                    <div>
                      <p className="text-white font-medium">{audioFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeAudioFile}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Adding Song...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Song
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-white font-medium mb-2">
              Song Artwork *
            </label>
            {!imageFile ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors group"
              >
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-green-500" />
                <p className="text-gray-400 group-hover:text-white">
                  Upload song artwork
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative aspect-square">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImageFile}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={loading}
            />
          </div>

          {/* Audio Preview */}
          {audioPreview && (
            <div>
              <label className="block text-white font-medium mb-2">
                Audio Preview
              </label>
              <audio
                controls
                src={audioPreview}
                className="w-full bg-gray-800 rounded-lg"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSong;