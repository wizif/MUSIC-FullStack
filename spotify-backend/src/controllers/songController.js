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
    const song = songModel(songData);
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
    console.log("🔍 Starting listSong function...");
    
    // Check database connection
    const mongoose = await import('mongoose');
    console.log("📊 Database connection state:", mongoose.default.connection.readyState);
    console.log("📁 Database name:", mongoose.default.connection.name);
    
    if (mongoose.default.connection.readyState !== 1) {
      console.error("❌ Database not connected");
      return res.json({ 
        success: false, 
        message: "Database not connected",
        connectionState: mongoose.default.connection.readyState 
      });
    }
    
    // Check collections in database
    const collections = await mongoose.default.connection.db.listCollections().toArray();
    console.log("📚 Available collections:", collections.map(c => c.name));
    
    // Try different possible collection names
    const possibleCollections = ['songs', 'song'];
    let foundCollection = null;
    
    for (const collectionName of possibleCollections) {
      if (collections.some(c => c.name === collectionName)) {
        foundCollection = collectionName;
        console.log(`✅ Found collection: ${collectionName}`);
        break;
      }
    }
    
    if (!foundCollection) {
      console.log("⚠️ No song collections found in database");
    }
    
    // Check what model is actually querying
    console.log("🔍 Song model collection name:", songModel.collection.name);
    
    // Count documents directly from collection
    const directCount = await mongoose.default.connection.db.collection(songModel.collection.name).countDocuments();
    console.log("📊 Direct count from collection:", directCount);
    
    // Fetch using the model
    console.log("🎵 Fetching songs using songModel.find({})...");
    const allSongs = await songModel.find({});
    console.log("📊 Songs found via model:", allSongs.length);
    
    if (allSongs.length > 0) {
      console.log("🎶 First song preview:", {
        id: allSongs[0]._id,
        name: allSongs[0].name,
        album: allSongs[0].album
      });
    }
    
    // Also try fetching with lean() for better performance
    const leanSongs = await songModel.find({}).lean();
    console.log("📊 Songs found via lean query:", leanSongs.length);
    
    res.json({ 
      success: true, 
      songs: allSongs,
      debug: {
        modelCollectionName: songModel.collection.name,
        directCount: directCount,
        modelCount: allSongs.length,
        leanCount: leanSongs.length,
        availableCollections: collections.map(c => c.name)
      }
    });
    
  } catch (error) {
    console.error("❌ Error in listSong:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    res.json({ 
      success: false, 
      message: error.message,
      errorType: error.name
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