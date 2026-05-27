import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Admin authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-passwordHash");

    if (!admin) {
      return res.status(401).json({ message: "Admin account no longer exists." });
    }

    req.admin = admin;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired admin session." });
  }
};
