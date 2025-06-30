
const jwt = require("jsonwebtoken");
const USERJWT_SECRET = process.env.USERJWT_SECRET;

async function userMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, USERJWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("User token verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = userMiddleware;
