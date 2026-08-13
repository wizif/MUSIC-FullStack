import React, { useState, useRef } from 'react';
import { Upload, Music, Image, Plus, X, CheckCircle } from 'lucide-react';
import { songAPI, validateFile } from '../../utils/api.js';
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

            {/* Album Selection */}
            <div>
              <label className="block text-white font-medium mb-2">
                Album *
              </label>
              <select
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">None (Single)</option>
                {albumsData.map((album) => (
                  <option key={album._id} value={album.name}>
                    {album.name}
                  </option>
                ))}
              </select>
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