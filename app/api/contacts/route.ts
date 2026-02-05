import { NextRequest, NextResponse } from 'next/server';  
import db from "@/db/client";

// CORS設定
const setCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
};

// OPTIONSメソッドへの対応（CORSプリフライトリクエスト）
export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({});  // 空のレスポンスを返す
  setCorsHeaders(res);  // CORSヘッダーを設定
  return new NextResponse(JSON.stringify({}), { status: 200 });  // ステータスコードを設定して新しいレスポンスを返す
}

// GETメソッド
export async function GET(req: NextRequest) {
  try {
    const password = req.nextUrl.searchParams.get('password');
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let contacts;

    if (typeof (db as any).execute === "function") {
      const result = await (db as any).execute({
        sql: "SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC",
      });
      contacts = result.results || result.rows || [];
    } else {
      contacts = (db as any)
        .prepare("SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC")
        .all();
    }

    const res = new NextResponse(JSON.stringify(contacts), { status: 200 });
    setCorsHeaders(res);
    return res;
  } catch (err: any) {
    const res = new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

// POSTメソッド
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, furigana, email, message } = body;

    if (!name || !email || !message) {
      return new NextResponse(JSON.stringify({ error: "name, email, and message are required" }), { status: 400 });
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)",
        args: [name, furigana || null, email, message],
      });
      console.log("[API] ✓ Contact saved to Turso");
    } else {
      (db as any)
        .prepare("INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)")
        .run(name, furigana || null, email, message);
    }

    const res = new NextResponse(JSON.stringify({ success: true, message: "Contact created" }), { status: 201 });
    setCorsHeaders(res);
    return res;
  } catch (err: any) {
    const res = new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

// DELETEメソッド
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (!id) {
      return new NextResponse(JSON.stringify({ error: "id is required" }), { status: 400 });
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "DELETE FROM contacts WHERE id = ?",
        args: [id],
      });
      console.log("[API] ✓ Contact deleted from Turso");
    } else {
      (db as any)
        .prepare("DELETE FROM contacts WHERE id = ?")
        .run(id);
    }

    const res = new NextResponse(JSON.stringify({ success: true, message: "Contact deleted" }), { status: 200 });
    setCorsHeaders(res);
    return res;
  } catch (err: any) {
    const res = new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}
