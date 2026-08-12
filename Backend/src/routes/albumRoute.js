import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
  getAlbumSongs,
} from "../controllers/albumController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/authMiddleware.js";

const albumRouter = express.Router();

// Public — album list used by PlayerContext before auth is established
albumRouter.get("/list", listAlbum);

// Private — all mutations and song lookups require JWT
albumRouter.post("/add", protect, upload.single("image"), addAlbum);
albumRouter.get("/:id/songs", protect, getAlbumSongs);
albumRouter.post("/remove", protect, removeAlbum);

export default albumRouter;