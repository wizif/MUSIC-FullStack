import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Protected routes
authRouter.get("/me", protect, getMe);

export default authRouter;
