import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

// @desc    Add a new song
// @route   POST /api/song/add
// @access  Private
const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    
    // 1. Enforce 10-song upload limit (save API calls by doing this first)
    const uploaderId = req.user._id;
    const songCount = await songModel.countDocuments({ uploader: uploaderId });
    
    if (songCount >= 10) {
      return res.json({
        success: false,
        message: "Upload limit reached: max 10 tracks per account.",
      });
    }

    const audioFile = req.files?.audio?.[0];
    const imageFile = req.files?.image?.[0];

    if (!audioFile || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload both audio and image files",
      });
    }

    console.log("🎵 Adding song:", { name, desc, album, uploader: uploaderId });

    // 2. Upload to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    // 3. Save to MongoDB
    const songData = {
      name,
      desc,
      album: album || "",
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
      uploader: uploaderId,
    };

    console.log("💾 Saving song data:", songData);
    const song = new songModel(songData);
    await song.save();
    console.log("✅ Song saved successfully with ID:", song._id);

    res.json({ success: true, message: "Song added successfully" });
  } catch (error) {
    console.error("❌ Error adding song:", error);
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all songs (SoundCloud global feed)
// @route   GET /api/song/list
// @access  Private
const listSong = async (req, res) => {
  try {
    console.log("📋 Fetching all songs...");
    const allSongs = await songModel.find({});
    console.log("📊 Songs found:", allSongs.length);
    
    res.json({ 
      success: true, 
      songs: allSongs
    });
  } catch (error) {
    console.error("❌ Error in listSong:", error);
    res.json({ 
      success: false, 
      message: error.message
    });
  }
};

// @desc    Get only current user's songs
// @route   GET /api/song/mine
// @access  Private
const getMySongs = async (req, res) => {
  try {
    const uploaderId = req.user._id;
    console.log(`📋 Fetching songs for user: ${uploaderId}`);
    const mySongs = await songModel.find({ uploader: uploaderId });
    console.log(`📊 Songs found for user:`, mySongs.length);

    res.json({
      success: true,
      songs: mySongs,
    });
  } catch (error) {
    console.error("❌ Error in getMySongs:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const publicIdWithExtension = lastPart.split('.')[0];
  return publicIdWithExtension;
};

// @desc    Remove a song
// @route   POST /api/song/remove
// @access  Private
const removeSong = async (req, res) => {
  try {
    const songId = req.body.id;
    const song = await songModel.findById(songId);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // Check ownership OR admin/superadmin roles
    if (
      song.uploader.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only remove your own tracks.",
      });
    }

    // Delete assets from Cloudinary to prevent storage leaks
    const audioPublicId = getPublicIdFromUrl(song.file);
    const imagePublicId = getPublicIdFromUrl(song.image);

    if (audioPublicId) {
      console.log("🗑️ Deleting audio from Cloudinary, public ID:", audioPublicId);
      await cloudinary.uploader.destroy(audioPublicId, { resource_type: "video" });
    }
    if (imagePublicId) {
      console.log("🗑️ Deleting image from Cloudinary, public ID:", imagePublicId);
      await cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });
    }

    await songModel.findByIdAndDelete(songId);
    res.json({ success: true, message: "Song removed successfully" });
  } catch (error) {
    console.error("❌ Error removing song:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addSong, listSong, getMySongs, removeSong };