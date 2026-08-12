import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Playlist name is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    songs: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const playlistModel = mongoose.models.playlist || mongoose.model("playlist", playlistSchema);

export default playlistModel;
