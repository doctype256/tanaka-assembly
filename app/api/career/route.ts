// app/api/career/route.ts
import { NextResponse } from "next/server";  // NextResponse をインポート
import db from "@/db/client";

// GETメソッドの処理
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    // CORS設定
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    if (password) {
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers,
        });
      }
    }

    let careers;
    if (typeof (db as any).execute === "function") {
      const result = await (db as any).execute({
        sql: "SELECT id, year, month, Content FROM career ORDER BY year DESC, month DESC",
      });
      careers = result.results || result.rows || [];
    } else {
      careers = (db as any)
        .prepare("SELECT id, year, month, Content FROM career ORDER BY year DESC, month DESC")
        .all();
    }

    return new NextResponse(JSON.stringify(careers), {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// POSTメソッドの処理
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { year, month, Content, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!year || !month || !Content) {
      return new NextResponse(
        JSON.stringify({
          error: "year, month, and Content are required",
        }),
        {
          status: 400,
        }
      );
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "INSERT INTO career (year, month, Content) VALUES (?, ?, ?)",
        args: [year, month, Content],
      });
    } else {
      (db as any)
        .prepare("INSERT INTO career (year, month, Content) VALUES (?, ?, ?)")
        .run(year, month, Content);
    }

    return new NextResponse(JSON.stringify({ success: true, message: "Career added" }), {
      status: 201,
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// DELETEメソッドの処理
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (password !== adminPassword) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!id) {
      return new NextResponse(JSON.stringify({ error: "id is required" }), {
        status: 400,
      });
    }

    if (typeof (db as any).execute === "function") {
      await (db as any).execute({
        sql: "DELETE FROM career WHERE id = ?",
        args: [id],
      });
    } else {
      (db as any).prepare("DELETE FROM career WHERE id = ?").run(id);
    }

    return new NextResponse(JSON.stringify({ success: true, message: "Career deleted" }), {
      status: 200,
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}