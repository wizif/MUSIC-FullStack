import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
  getAlbumSongs,
} from "../controllers/albumController.js";
import upload from "../middleware/multer.js";

const albumRouter = express.Router();

albumRouter.post("/add", upload.single("image"), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.get("/:id/songs", getAlbumSongs); // NEW: Get songs by album ID
albumRouter.post("/remove", removeAlbum);

export default albumRouter;