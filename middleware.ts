// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const host = request.headers.get("host");

  // 管理画面用ドメインなら /admin を自動付与
  if (host === "admin-tanaka-assembly.vercel.app") {
    if (!pathname.startsWith("/admin")) {
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 認証チェック
  const isAdmin = request.cookies.get('is_admin')?.value === 'true';

  // /admin 直下のページはログイン画面
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

  if (pathname.startsWith('/admin') && !isLoginPage) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\..*).*)'
  ],
};
