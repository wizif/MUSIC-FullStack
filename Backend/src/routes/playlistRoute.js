import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import playlistModel from "../models/playlistModel.js";

const playlistRouter = express.Router();

// Get all playlists for the logged-in user
playlistRouter.get("/", protect, async (req, res) => {
  try {
    const playlists = await playlistModel.find({ user: req.user._id });
    res.json({ success: true, playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new playlist
playlistRouter.post("/create", protect, async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Playlist name is required" });
    }

    const playlist = await playlistModel.create({
      name,
      user: req.user._id,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      songs: []
    });

    res.status(201).json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a song to a playlist
playlistRouter.post("/:playlistId/add", protect, async (req, res) => {
  try {
    const { song } = req.body;
    if (!song || !song._id) {
      return res.status(400).json({ success: false, message: "Valid song object is required" });
    }

    const playlist = await playlistModel.findOne({ _id: req.params.playlistId, user: req.user._id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    // Check if song already exists in playlist to avoid duplicates
    const songExists = playlist.songs.some((s) => s._id === song._id);
    if (songExists) {
      return res.status(400).json({ success: false, message: "Song is already in this playlist" });
    }

    playlist.songs.push(song);
    await playlist.save();

    res.json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove a song from a playlist
playlistRouter.post("/:playlistId/remove", protect, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ success: false, message: "Song ID is required" });
    }

    const playlist = await playlistModel.findOne({ _id: req.params.playlistId, user: req.user._id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter((s) => s._id !== songId);
    await playlist.save();

    res.json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single playlist by ID
playlistRouter.get("/:playlistId", protect, async (req, res) => {
  try {
    const playlist = await playlistModel.findOne({ _id: req.params.playlistId, user: req.user._id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }
    res.json({ success: true, playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a playlist
playlistRouter.delete("/:playlistId", protect, async (req, res) => {
  try {
    const result = await playlistModel.deleteOne({ _id: req.params.playlistId, user: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Playlist not found or unauthorized" });
    }
    res.json({ success: true, message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default playlistRouter;
