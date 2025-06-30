
const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const { courseRouter } = require("./routes/course");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const Connection = require("./config");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userModel, adminModel } = require("./database/db");
const JWT_SECRET = process.env.USERJWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

async function verifyTokenWithRole(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id, role } = decoded;

    let user;
    if (role === "user") {
      user = await userModel.findById(id).select("-password");
    } else if (role === "admin") {
      user = await adminModel.findById(id).select("-password");
    }

    if (!user) return res.status(404).json({ message: "Account not found" });

    req.user = user;
    req.role = role;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

Connection();

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/api/v1/me", verifyTokenWithRole, (req, res) => {
  res.json({
    user: req.user,
    role: req.role,
  });
});

app.post("/api/v1/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
