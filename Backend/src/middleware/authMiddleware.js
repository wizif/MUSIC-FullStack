import jwt from "jsonwebtoken";

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID and role to request object
      req.userId = decoded.userId;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      console.error("❌ Auth Middleware Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
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

export { protect };
