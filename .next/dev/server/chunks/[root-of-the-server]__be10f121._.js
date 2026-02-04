module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/db/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
// db/client.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__ = __turbopack_context__.i("[externals]/@libsql/client [external] (@libsql/client, esm_import, [project]/node_modules/@libsql/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
/**
 * db の型: Turso Client
 */ let db;
// ===== Turso (Local & Production) =====
const tursoUrl = process.env.TURSO_DATABASE_URL || "libsql://testdata-kyoto343.aws-ap-northeast-1.turso.io";
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (!tursoToken) {
    throw new Error("TURSO_AUTH_TOKEN is not set in environment variables");
}
db = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__["createClient"])({
    url: tursoUrl,
    authToken: tursoToken
});
console.log("✅ Using Turso database");
const __TURBOPACK__default__export__ = db;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/comments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// app/api/comments/route.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/client.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    // CORS設定
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    // ===== GET: 記事のコメント一覧を取得 =====
    if (req.method === "GET") {
        try {
            const { article_title, all, password } = req.query;
            // 管理者リクエスト
            if (all === "true") {
                const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
                if (password !== adminPassword) {
                    return res.status(401).json({
                        error: "Unauthorized"
                    });
                }
                let comments;
                if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute === "function") {
                    // Turso (Production)
                    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute({
                        sql: "SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC"
                    });
                    comments = result.results || result.rows || [];
                } else {
                    // SQLite (Local)
                    comments = __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("SELECT id, article_title, name, message, approved, created_at FROM comments ORDER BY created_at DESC").all();
                }
                return res.status(200).json(comments);
            }
            // 通常リクエスト（承認済みのみ）
            if (!article_title) {
                return res.status(400).json({
                    error: "article_title is required"
                });
            }
            let comments;
            if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute === "function") {
                // Turso (Production)
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute({
                    sql: "SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC",
                    args: [
                        article_title
                    ]
                });
                comments = result.results || result.rows || [];
            } else {
                // SQLite (Local)
                comments = __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("SELECT id, article_title, name, message, created_at FROM comments WHERE article_title = ? AND approved = 1 ORDER BY created_at DESC").all(article_title);
            }
            return res.status(200).json(comments);
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
    // ===== POST: 新しいコメントを作成 =====
    if (req.method === "POST") {
        try {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const { article_title, name, message } = body;
            if (!article_title || !name || !message) {
                return res.status(400).json({
                    error: "article_title, name, and message are required"
                });
            }
            if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute === "function") {
                // Turso (Production)
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute({
                    sql: "INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)",
                    args: [
                        article_title,
                        name,
                        message
                    ]
                });
                console.log("[API] ✓ Comment saved to Turso");
            } else {
                // SQLite (Local)
                __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("INSERT INTO comments (article_title, name, message) VALUES (?, ?, ?)").run(article_title, name, message);
            }
            return res.status(201).json({
                success: true,
                message: "Comment created"
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
    // ===== PATCH: 承認状態を更新 =====
    if (req.method === "PATCH") {
        try {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const { id, approved, password } = body;
            const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
            if (password !== adminPassword) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }
            if (id === undefined || approved === undefined) {
                return res.status(400).json({
                    error: "id and approved are required"
                });
            }
            if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute === "function") {
                // Turso (Production)
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute({
                    sql: "UPDATE comments SET approved = ? WHERE id = ?",
                    args: [
                        approved ? 1 : 0,
                        id
                    ]
                });
                console.log("[API] ✓ Comment approval updated in Turso");
            } else {
                // SQLite (Local)
                __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("UPDATE comments SET approved = ? WHERE id = ?").run(approved ? 1 : 0, id);
            }
            return res.status(200).json({
                success: true,
                message: "Comment approval updated"
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
    // ===== DELETE: コメント削除 =====
    if (req.method === "DELETE") {
        try {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
            const { id, password } = body;
            // 簡易的な管理者認証（環境変数から取得）
            const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
            if (password !== adminPassword) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }
            if (!id) {
                return res.status(400).json({
                    error: "id is required"
                });
            }
            if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute === "function") {
                // Turso (Production)
                await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].execute({
                    sql: "DELETE FROM comments WHERE id = ?",
                    args: [
                        id
                    ]
                });
                console.log("[API] ✓ Comment deleted from Turso");
            } else {
                // SQLite (Local)
                __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].prepare("DELETE FROM comments WHERE id = ?").run(id);
            }
            return res.status(200).json({
                success: true,
                message: "Comment deleted"
            });
        } catch (err) {
            return res.status(500).json({
                error: err.message
            });
        }
    }
    return res.status(405).json({
        error: "Method not allowed"
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__be10f121._.js.map