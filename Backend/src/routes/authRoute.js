import express from "express";
import rateLimit from "express-rate-limit";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Rate limiter for auth endpoints: 15 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: {
    success: false,
    message: "Too many login/registration attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes with rate limit protection
authRouter.post("/register", authLimiter, registerUser);
authRouter.post("/login", authLimiter, loginUser);

// Protected routes
authRouter.get("/me", protect, getMe);

export default authRouter;
