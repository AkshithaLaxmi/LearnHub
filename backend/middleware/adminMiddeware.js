import jwt from "jsonwebtoken";
import { adminModel } from "../database/db";
const ADMINJWT_SECRET = process.env.ADMINJWT_SECRET;

export default async function adminMiddleware(req, res, next) {
  const token = req.cookies.token; // prefer cookies for secure auth
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, ADMINJWT_SECRET);
    const { role, id } = decoded;

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const admin = await adminModel.findById(id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    req.adminId = admin._id;
    next();
  } catch (err) {
    console.error("Admin token verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
}
