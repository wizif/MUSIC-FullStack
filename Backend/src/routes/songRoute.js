import express from "express";
import {
  addSong,
  listSong,
  getMySongs,
  removeSong,
} from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/authMiddleware.js";

const songRouter = express.Router();

// Public — browsing the feed requires no auth (same as SoundCloud's public page)
songRouter.get("/list", listSong);

// Private — all mutations and user-specific routes require JWT
songRouter.post(
  "/add",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);
songRouter.get("/mine", protect, getMySongs);
songRouter.post("/remove", protect, removeSong);

export default songRouter;
