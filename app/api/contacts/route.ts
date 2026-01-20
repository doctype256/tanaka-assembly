import { NextResponse } from "next/server";
// 🟢 getDbClient をインポート（パスが違う場合は適宜調整してください）
import { getDbClient } from "@/lib/db"; 

export const runtime = "nodejs";

export async function POST(request: Request) {
  console.log("=== POST /api/contact start ===");

  try {
    // 🟢 関数の外ではなく、この中でクライアントを取得する
    // これにより、ビルド時に環境変数がなくてもクラッシュしなくなります
    const client = getDbClient();

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