const express = require("express");
const app = express();
const db = require("./db/Database");
const ENV = require("./env");
const port = ENV.Back_Port;
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");

// ✅ Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max requests per IP
  message: "Too many requests from this IP. Please try again later.",
});

// ✅ Body parser
app.use(express.json());

// ✅ Rate limiting
app.use(limiter);

// ✅ CORS Fix: Allow frontend to access backend
const cors = require("cors");
app.use(
  cors({
    origin: ENV.Front_Origin || "http://localhost:3000", // Frontend origin
    methods: "GET,HEAD,PUT,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Import routers
const AdminRouter = require("./router/AdminRouter");
const DoctorRouter = require("./router/DoctorRouter");
const PlayerModel = require("./controller/Player");

// ✅ Attach routers
app.use(AdminRouter);
app.use(DoctorRouter);
app.use(PlayerModel);

// ✅ Log every request
app.use((req, res, next) => {
  console.warn("------------------------------------------------------");
  console.log(`Request URL: ${req.url}, Method: ${req.method}`);
  console.warn("------------------------------------------------------");
  next();
});

// ✅ Error handler
app.use((err, req, res, _) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "Server error" });
});

// ✅ Catch unknown routes
app.all("*", (req, res) => {
  return res.status(400).json({ error: "Wrong Path" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
