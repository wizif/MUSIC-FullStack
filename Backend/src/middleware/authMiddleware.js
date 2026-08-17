import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const secret = process.env.JWT_SECRET || "supersecretjwtkey12345!";
      const decoded = jwt.verify(token, secret);

      // Load user from database, excluding password
      const user = await userModel.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      // Attach user object to request
      req.user = user;

      return next();
    } catch (error) {
      console.error("❌ Auth Middleware Error:", error.message);
      
      let message = "Not authorized, token failed";
      if (error.name === "TokenExpiredError") {
        message = "Session expired, please login again";
      } else if (error.name === "JsonWebTokenError") {
        message = "Invalid token, authorization denied";
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// Middleware factory for role checks
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user credentials missing",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden, insufficient permissions",
      });
    }

    next();
  };
};

export { protect, requireRole };
