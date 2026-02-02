import type { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== POST: 画像をCloudinaryにアップロード =====
  if (req.method === "POST") {
    try {
      const { file_data, filename, folder, password } = req.body;

      // 管理者認証
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // ファイルデータのバリデーション
      if (!file_data || !filename) {
        return res.status(400).json({ error: "Missing file_data or filename" });
      }

      // Cloudinaryにアップロード
      const uploadResult = await cloudinary.uploader.upload(file_data, {
        resource_type: "auto",
        public_id: filename.split(".")[0],
        folder: folder || "uploads",
        overwrite: false,
      });

      return res.status(200).json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        filename: filename,
        uploaded_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
