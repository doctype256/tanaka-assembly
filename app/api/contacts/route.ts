// app/api/contacts/route.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "@/db/client";


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ===== GET: すべてのお問い合わせを取得（管理者のみ）=====
  if (req.method === "GET") {
    try {
      const { password } = req.query;

      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let contacts;

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        const result = await (db as any).execute({
          sql: "SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC",
        });
        contacts = result.results || result.rows || [];
      } else {
        // SQLite (Local)
        contacts = (db as any)
          .prepare(
            "SELECT id, name, furigana, email, message, created_at FROM contacts ORDER BY created_at DESC"
          )
          .all();
      }

      return res.status(200).json(contacts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== POST: 新しいお問い合わせを作成 =====
  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { name, furigana, email, message } = body;

      if (!name || !email || !message) {
        return res.status(400).json({
          error: "name, email, and message are required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)",
          args: [name, furigana || null, email, message],
        });
        console.log("[API] ✓ Contact saved to Turso");
      } else {
        // SQLite (Local)
        (db as any)
          .prepare(
            "INSERT INTO contacts (name, furigana, email, message) VALUES (?, ?, ?, ?)"
          )
          .run(name, furigana || null, email, message);
      }

      return res.status(201).json({ success: true, message: "Contact created" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ===== DELETE: お問い合わせを削除 =====
  if (req.method === "DELETE") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      const { id, password } = body;

      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!id) {
        return res.status(400).json({
          error: "id is required",
        });
      }

      if (typeof (db as any).execute === "function") {
        // Turso (Production)
        await (db as any).execute({
          sql: "DELETE FROM contacts WHERE id = ?",
          args: [id],
        });
        console.log("[API] ✓ Contact deleted from Turso");
      } else {
        // SQLite (Local)
        (db as any)
          .prepare("DELETE FROM contacts WHERE id = ?")
          .run(id);
      }

      return res
        .status(200)
        .json({ success: true, message: "Contact deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
