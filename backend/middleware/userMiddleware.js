import jwt from "jsonwebtoken";
const USERJWT_SECRET = process.env.USERJWT_SECRET;

export default function userMiddlware(req, res, next) {
  const token = req.header("token");
  const verifyToken = jwt.verify(token, USERJWT_SECRET);
  if (verifyToken) {
    req.userId = verifyToken.id;
    next();
  } else {
    res.json({
      message: "You are not signed in",
    });
  }
}
