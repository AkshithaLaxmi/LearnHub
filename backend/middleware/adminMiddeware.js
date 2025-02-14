import jwt from "jsonwebtoken";
const ADMINJWT_SECRET = process.env.ADMINJWT_SECRET;
// import jwt from "jsonwebtoken";

export default function adminMiddleware(req, res, next) {
  const token = req.header("token");
  const verifyToken = jwt.verify(token, ADMINJWT_SECRET);
  if (verifyToken) {
    req.adminId = verifyToken.id;
    next();
  } else {
    res.json({
      message: "You are not signed in",
    });
  }
}
