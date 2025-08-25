import React, { useState, useRef } from 'react';
import { Upload, Album, Image, Plus, X, CheckCircle } from 'lucide-react';
import { albumAPI, validateFile } from '../../utils/api.js';
import { usePlayer } from '../../context/PlayerContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const AddAlbum = () => {
  const { loadAlbums } = usePlayer();
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    bgColour: '#1DB954', // Default Spotify green
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const imageInputRef = useRef(null);

  const colorPresets = [
    '#1DB954', // Spotify Green
    '#1E3A8A', // Blue
    '#7C3AED', // Purple
    '#DC2626', // Red
    '#EA580C', // Orange
    '#059669', // Emerald
    '#7C2D12', // Brown
    '#374151', // Gray
    '#BE185D', // Pink
    '#0891B2', // Cyan
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      bgColour: color
    });
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
      if (!formData.name.trim()) throw new Error('Album name is required');
      if (!formData.desc.trim()) throw new Error('Album description is required');
      if (!imageFile) throw new Error('Album artwork is required');

      const albumData = {
        ...formData,
        imageFile,
      };

      const response = await albumAPI.add(albumData);
      
      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({ name: '', desc: '', bgColour: '#1DB954' });
        setImageFile(null);
        setImagePreview(null);
        
        // Clear file input
        if (imageInputRef.current) imageInputRef.current.value = '';
        
        // Reload albums data
        await loadAlbums();
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response.message || 'Failed to add album');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-white mb-2">Add New Album</h1>
        <p className="text-gray-400">Create a new album for organizing your songs</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-green-400">Album added successfully!</span>
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
            {/* Album Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                Album Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter album name"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Album Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Album Description *
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                placeholder="Enter album description"
                rows={3}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-white font-medium mb-2">
                Background Color
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.bgColour === color 
                          ? 'border-white scale-110' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      disabled={loading}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.bgColour}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
                  disabled={loading}
                />
                <div className="text-gray-400 text-sm">
                  Selected: {formData.bgColour}
                </div>
              </div>
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
                  Adding Album...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Album
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Album Artwork Upload */}
          <div>
            <label className="block text-white font-medium mb-2">
              Album Artwork *
            </label>
            {!imageFile ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors group"
              >
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-green-500" />
                <p className="text-gray-400 group-hover:text-white">
                  Upload album artwork
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative aspect-square">
                <img
                  src={imagePreview}
                  alt="Album Preview"
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

          {/* Album Preview */}
          {(formData.name || imagePreview) && (
            <div>
              <label className="block text-white font-medium mb-2">
                Album Preview
              </label>
              <div 
                className="relative rounded-lg overflow-hidden p-6"
                style={{
                  background: `linear-gradient(135deg, ${formData.bgColour} 0%, #121212 100%)`
                }}
              >
                <div className="flex items-end space-x-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Album className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 mb-1">ALBUM</p>
                    <h3 className="text-white font-bold text-lg">
                      {formData.name || 'Album Name'}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {formData.desc || 'Album description will appear here'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAlbum;