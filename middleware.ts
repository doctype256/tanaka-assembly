// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 現在アクセスしようとしているパスを取得
  const { pathname } = request.nextUrl;

  // 2. Cookieから「is_admin」というログインの証拠があるか確認
  const isAdmin = request.cookies.get('is_admin')?.value === 'true';

  // 3. /admin 以下のページ（ログイン画面以外）にアクセスしようとした場合
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // ログインしていなければ、ログイン画面へ強制送還
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// チェックを実行する対象のパスを指定（/admin 以下すべて）
export const config = {
  matcher: ['/admin/:path*'],
};