// app/api/profile/route.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "@/db/client";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================================================
  // GET : 最新プロフィール取得
  // =========================================================
  if (req.method === "GET") {
    try {
      const { password } = req.query;

      // 管理パスワードが来た場合のみチェック（公開APIとしても使える）
      if (password) {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        if (password !== adminPassword) {
          return res.status(401).json({ error: "Unauthorized" });
        }
      }

      let profile: any;

      if (typeof (db as any).execute === "function") {
        // Turso
        const result = await (db as any).execute({
          sql: "SELECT * FROM profile ORDER BY id DESC LIMIT 1",
        });

        profile = result.results?.[0] || result.rows?.[0];
      } else {
        // SQLite
        profile = (db as any)
          .prepare("SELECT * FROM profile ORDER BY id DESC LIMIT 1")
          .get();
      }

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      return res.status(200).json(profile);
    } catch (err: any) {
      console.error("[Profile GET] Error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // =========================================================
  // POST : プロフィール保存
  // =========================================================
  if (req.method === "POST") {
    try {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

      const {
        Name,
        IMG_URL,
        birthday = null,
        From = null,
        Family = null,
        Job = null,
        hobby = null,
        password,
      } = body;

      console.log("[Profile POST] Incoming:", {
        Name,
        IMG_URL,
        birthday,
        From,
        Family,
        Job,
        hobby,
      });

      // ===== 管理者認証 =====
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (password !== adminPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // ===== 必須チェック =====
      if (!Name || !IMG_URL) {
        return res.status(400).json({
          error: "Name and IMG_URL are required",
        });
      }

      // =========================================================
      // INSERT
      // =========================================================

      if (typeof (db as any).execute === "function") {
        // ===== Turso =====
        await (db as any).execute({
          sql: `
            INSERT INTO profile
            (Name, IMG_URL, birthday, "From", Family, Job, hobby)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            Name,
            IMG_URL,
            birthday,
            From,
            Family,
            Job,
            hobby,
          ],
        });
      } else {
        // ===== SQLite =====
        (db as any)
          .prepare(`
            INSERT INTO profile
            (Name, IMG_URL, birthday, "From", Family, Job, hobby)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          .run(
            Name,
            IMG_URL,
            birthday,
            From,
            Family,
            Job,
            hobby
          );
      }

      console.log("[Profile POST] Saved OK");

      return res.status(200).json({
        success: true,
        message: "Profile saved",
      });
    } catch (err: any) {
      console.error("[Profile POST] Error:", err);
      return res.status(500).json({
        error: err.message || "Unknown error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM profile")
    return Response.json(result)
  } catch (error) {
    console.error(error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
