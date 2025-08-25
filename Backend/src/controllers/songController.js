import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    
    console.log("🎵 Adding song:", { name, desc, album });
    
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    console.log("💾 Saving song data:", songData);
    const song = new songModel(songData); // ✅ Fixed: Added 'new' keyword
    await song.save();
    console.log("✅ Song saved successfully with ID:", song._id);

    res.json({ success: true, message: "Song added successfully" });
  } catch (error) {
    console.error("❌ Error adding song:", error);
    res.json({ success: false, message: error.message });
  }
};

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

const removeSong = async (req, res) => {
  try {
    await songModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Song removed successfully" });
  } catch (error) {
    console.error("Error removing song:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addSong, listSong, removeSong };