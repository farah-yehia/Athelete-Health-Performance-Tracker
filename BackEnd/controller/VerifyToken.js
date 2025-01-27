const {Secret_Key}=require('../env');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

// Middleware to verify tokens based on role
const verifyToken = (requiredRole) => {
  return (req, res, next) => {
    const authorization = req.headers["authorization"];
const verifyToken = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token is missing. Please log in." });
    }

    try {
      const decoded = jwt.verify(token, Secret_Key);

      // Check role authorization
      if (decoded.role.toLowerCase() !== requiredRole.toLowerCase()) {
        return res.status(403).json({ error: "You are not authorized." });
      }

      req.user = decoded; // Attach token data to request
      next();
    } catch (error) {
      res.status(403).json({
        error:
          error.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Invalid token.",
      });
    }
  };
};

    if (!authorization) {
      return res.status(401).json({ error: "You must login first" });
    }

    try {
      // Decode the token
      const decoded = jwt.verify(authorization, Secret_Key);

      // Normalize the role and check permissions
      const role = decoded.role.toLowerCase();
      if (role !== requiredRole.toLowerCase()) {
        return res.status(403).json({ error: "You are not authorized" });
      }

      // Attach decoded token data to `req.user`
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        error:
          error.name === "TokenExpiredError"
            ? "Session Expired, please login again"
            : "Invalid credentials",
      });
    }
  };
};

module.exports = verifyToken;