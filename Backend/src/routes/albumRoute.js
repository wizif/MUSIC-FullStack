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

// All album routes are protected by JWT authentication
albumRouter.post("/add", protect, upload.single("image"), addAlbum);
albumRouter.get("/list", protect, listAlbum);
albumRouter.get("/:id/songs", protect, getAlbumSongs);
albumRouter.post("/remove", protect, removeAlbum);

export default albumRouter;