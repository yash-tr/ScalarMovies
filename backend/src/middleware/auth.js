import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};