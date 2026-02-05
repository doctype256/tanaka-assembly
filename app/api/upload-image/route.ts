import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== POST: 画像アップロード =====
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file_data, filename, folder, password } = body;

    // 管理者認証
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file_data || !filename) {
      return NextResponse.json(
        { error: "Missing file_data or filename" },
        { status: 400 }
      );
    }

    // Cloudinaryにアップロード
    const uploadResult = await cloudinary.uploader.upload(file_data, {
      resource_type: "auto",
      public_id: filename.split(".")[0],
      folder: folder || "uploads",
      overwrite: false,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      filename,
      uploaded_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
  }
}

// ===== OPTIONS (CORS) =====
export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
