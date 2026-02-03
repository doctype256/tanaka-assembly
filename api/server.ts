import "dotenv/config";
import express from "express";

import commentsHandler from "./comments";
import contactsHandler from "./contacts";
import profileHandler from "./profile";
import careerHandler from "./career";
import pdfsHandler from "./pdfs";
import postsHandler from "./posts";
import uploadImageHandler from "./upload-image";
import activityReportsHandler from "./activity-reports";

const app = express();

// ⭐ ここを変更
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ===== API Routes =====
app.all("/api/comments", (req, res) => commentsHandler(req as any, res as any));
app.all("/api/contacts", (req, res) => contactsHandler(req as any, res as any));
app.all("/api/profile", (req, res) => profileHandler(req as any, res as any));
app.all("/api/career", (req, res) => careerHandler(req as any, res as any));
app.all("/api/pdfs", (req, res) => pdfsHandler(req as any, res as any));
app.all("/api/posts", (req, res) => postsHandler(req as any, res as any));
app.all("/api/upload-image", (req, res) => uploadImageHandler(req as any, res as any));
app.all("/api/activity-reports", (req, res) => activityReportsHandler(req as any, res as any));

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
