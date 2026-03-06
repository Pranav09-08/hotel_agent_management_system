import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Middleware to check if user is sales manager
export const isSalesManager = (req, res, next) => {
  if (req.user.userType !== "sales_manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Sales Manager privileges required.",
    });
  }
  next();
};

// Middleware to allow both admin and sales manager
export const isAdminOrSalesManager = (req, res, next) => {
  if (
    req.user.userType !== "admin" &&
    req.user.userType !== "sales_manager"
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Insufficient privileges.",
    });
  }
  next();
};
