import jwt from "jsonwebtoken";
const USERJWT_SECRET = process.env.USERJWT_SECRET;

export default async function userMiddlware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, USERJWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      next();
    }
  } catch (err) {
    console.error("Admin token verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
}
