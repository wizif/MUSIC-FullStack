import express from "express";
import { listUsers, setUserRole } from "../controllers/superadminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const superadminRouter = express.Router();

// Apply superadmin authorization middleware to all routes in this router
superadminRouter.use(protect);
superadminRouter.use(requireRole("superadmin"));

superadminRouter.get("/users", listUsers);
superadminRouter.post("/set-role", setUserRole);

export default superadminRouter;
