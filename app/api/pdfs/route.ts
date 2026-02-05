// app/api/pdfs/route.ts
import { NextResponse } from "next/server";
import db from "@/db/client";

// ===== GET =====
export async function GET() {
  try {
    const result = await db.execute(`
      SELECT *
      FROM pdfs
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET PDFs error:", error);
    return NextResponse.json({ error: "Failed to fetch PDFs" }, { status: 500 });
  }
}

// ===== POST =====
export async function POST(request: Request) {
  try {
    const body = await request.json();

    await db.execute({
      sql: `
        INSERT INTO pdfs (
          title,
          description,
          file_path,
          file_name,
          created_at
        )
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        body.title,
        body.description,
        body.file_path,
        body.file_name
      ]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("POST PDFs error:", error);
    return NextResponse.json({ error: "Failed to save PDF" }, { status: 500 });
  }
}

// ===== DELETE =====
export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    await db.execute({
      sql: `DELETE FROM pdfs WHERE id = ?`,
      args: [body.id]
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE PDFs error:", error);
    return NextResponse.json({ error: "Failed to delete PDF" }, { status: 500 });
  }
}