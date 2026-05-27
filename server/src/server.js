import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import fs from "fs";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./utils/seedAdmin.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDist = path.resolve(rootDir, "..", "client", "dist");

["uploads", "uploads/resumes", "uploads/photos"].forEach((folder) => {
  fs.mkdirSync(path.resolve(rootDir, folder), { recursive: true });
});

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "hirewave-api",
    dbReady: global.dbReady === true,
    time: new Date().toISOString()
  });
});

app.use("/api/otp", otpRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  global.dbReady = await connectDB();
  if (global.dbReady) {
    await seedAdmin();
  }

  app.listen(port, () => {
    console.log(`HireWave API running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
