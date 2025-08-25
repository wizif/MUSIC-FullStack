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

const removeAlbum = async (req, res) => {
  try {
    await albumModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Album removed successfully" });
  } catch (error) {
    console.error("Error removing album:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addAlbum, listAlbum, removeAlbum, getAlbumSongs };