import express from "express";
import {
  addSong,
  listSong,
  removeSong,
} from "../controllers/songController.js";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/authMiddleware.js";

const songRouter = express.Router();

// All routes are protected by JWT authentication
songRouter.post(
  "/add",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);
songRouter.get("/list", protect, listSong);
songRouter.post("/remove", protect, removeSong);

export default songRouter;
