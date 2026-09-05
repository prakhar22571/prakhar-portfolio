import os from "os";
import { unlink } from "node:fs/promises";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { dbConnection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import { catchAsyncErrors } from "./middlewares/catchAsyncErrors.js";
import userRouter from "./routes/userRouter.js";
import timelineRouter from "./routes/timelineRouter.js";
import messageRouter from "./routes/messageRouter.js";
import skillRouter from "./routes/skillRouter.js";
import softwareApplicationRouter from "./routes/softwareApplicationRouter.js";
import projectRouter from "./routes/projectRouter.js";
import { MAX_UPLOAD_SIZE } from "./utils/assets.js";

dotenv.config({ path: "./config/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.get("/", (req, res) => res.status(200).json({ status: "ok" }));

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    limits: { fileSize: MAX_UPLOAD_SIZE, files: 2 },
    abortOnLimit: true,
    limitHandler: (req, res) => {
      if (!res.headersSent)
        res.status(413).json({
          success: false,
          message: "Files must be 10 MB or smaller.",
        });
    },
  }),
);

app.use((req, res, next) => {
  res.once("finish", () => {
    const files = Object.values(req.files || {}).flat();
    for (const file of files)
      if (file.tempFilePath) unlink(file.tempFilePath).catch(() => {});
  });
  next();
});

// Ensure the DB connection is ready before any route handler runs. On serverless
// this lazily connects on the first request and reuses the cached connection
// afterwards.
app.use(
  catchAsyncErrors(async (req, res, next) => {
    await dbConnection();
    next();
  }),
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found." }),
);
app.use(errorMiddleware);

export default app;
