import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const setCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
};

// OPTIONS
export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({});
  setCorsHeaders(res);
  return res;
}

// POST
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file_data");
    const filename = formData.get("filename");
    const folder = formData.get("folder") || "uploads";
    const password = formData.get("password");

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file || !filename || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    // ✅ File → Buffer 変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Cloudinary upload_stream 使用
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: filename.toString().split(".")[0],
          folder: folder.toString(),
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    const res = NextResponse.json({
      success: true,
      url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
      filename,
      uploaded_at: new Date().toISOString(),
    });

    setCorsHeaders(res);
    return res;

  } catch (error) {
    console.error("Upload error:", error);

    const res = NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );

    setCorsHeaders(res);
    return res;
  }
}
