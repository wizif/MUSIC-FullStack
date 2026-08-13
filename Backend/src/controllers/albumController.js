import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";
import songModel from "../models/songModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColour = req.body.bgColour;
    const imageFile = req.file;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    const album = new albumModel(albumData);
    await album.save();

    res.json({ success: true, message: "Album added successfully" });
  } catch (error) {
    console.error("❌ Error adding album:", error);
    res.json({ success: false, message: error.message });
  }
};

const listAlbum = async (req, res) => {
  try {
    console.log("📋 Fetching all albums...");
    const allAlbums = await albumModel.find({});
    console.log("📊 Albums found:", allAlbums.length);
    
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    console.error("❌ Error in listAlbum:", error);
    res.json({ success: false, message: error.message });
  }
};

// NEW: Get songs by album
const getAlbumSongs = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🎵 Fetching songs for album ID:", id);
    
    // First find the album
    const album = await albumModel.findById(id);
    if (!album) {
      return res.json({ success: false, message: "Album not found" });
    }
    
    // Find songs that belong to this album (by album name or ID)
    const albumSongs = await songModel.find({
      $or: [
        { album: album.name },
        { album: id }
      ]
    });
    
    console.log(`📊 Found ${albumSongs.length} songs for album: ${album.name}`);
    
    res.json({ 
      success: true, 
      album: album,
      songs: albumSongs 
    });
  } catch (error) {
    console.error("❌ Error fetching album songs:", error);
    res.json({ success: false, message: error.message });
  }
};

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const publicIdWithExtension = lastPart.split('.')[0];
  return publicIdWithExtension;
};

const removeAlbum = async (req, res) => {
  try {
    const albumId = req.body.id;
    const album = await albumModel.findById(albumId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Delete image from Cloudinary
    const imagePublicId = getPublicIdFromUrl(album.image);
    if (imagePublicId) {
      console.log("🗑️ Deleting album cover image from Cloudinary, public ID:", imagePublicId);
      await cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });
    }

    await albumModel.findByIdAndDelete(albumId);
    res.json({ success: true, message: "Album removed successfully" });
  } catch (error) {
    console.error("Error removing album:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addAlbum, listAlbum, removeAlbum, getAlbumSongs };