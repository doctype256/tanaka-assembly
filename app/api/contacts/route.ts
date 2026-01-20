import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export const runtime = "nodejs"; // ← Turso必須

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("TURSO_DATABASE_URL が設定されていません");
}

const client = createClient({
  url,
  authToken,
});

export async function POST(request: Request) {
  console.log("=== POST /api/contact start ===");

  try {
    const body = await request.json();
    console.log("📥 request body:", body);

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // ✅ 日本時間（JST）ISO文字列
    const jstDate = new Date(
      new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    ).toISOString();

    await client.execute({
      sql: `
        INSERT INTO contacts
          (name, email, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        String(name),
        String(email),
        "Webサイトからのお問い合わせ",
        String(message),
        "New",
        jstDate,
      ],
    });

    console.log("✅ Contact saved");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ API error:", error);

    return NextResponse.json(
      {
        error: "送信に失敗しました",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
