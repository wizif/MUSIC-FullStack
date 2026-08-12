import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { listUsersForAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Get users list (allows both admin and superadmin to view/monitor)
adminRouter.get("/users", protect, requireRole("admin", "superadmin"), listUsersForAdmin);

export default adminRouter;
