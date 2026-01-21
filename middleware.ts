// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const host = request.headers.get("host");

  // -----------------------------
  // ① admin.example.com の場合は /admin を自動付与
  // -----------------------------
  if (host === "admin.example.com") {
    // すでに /admin から始まっていない場合だけ付ける
    if (!pathname.startsWith("/admin")) {
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // -----------------------------
  // ② 管理画面の認証チェック
  // -----------------------------
  const isAdmin = request.cookies.get('is_admin')?.value === 'true';

  // /admin 以下（ただし /admin/login は除外）
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// 適用範囲
export const config = {
  matcher: [
    '/admin/:path*',   // 管理画面の認証チェック
    '/:path*'          // ドメイン振り分けのため全体に適用
  ],
};
