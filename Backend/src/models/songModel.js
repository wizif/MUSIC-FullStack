import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Song name is required"],
  },
  desc: {
    type: String,
    required: [true, "Song description is required"],
  },
  album: {
    type: String,
    required: false, // Optional for SoundCloud style individual uploads
    default: "",
  },
  image: {
    type: String,
    required: [true, "Image URL is required"],
  },
  file: {
    type: String,
    required: [true, "Audio file URL is required"],
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Uploader is required"],
  },
}, {
  timestamps: true,
});

const songModel = mongoose.models.song || mongoose.model("song", songSchema);

export default songModel;