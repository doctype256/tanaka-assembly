// app/admin/layout.tsx
import AdminLayoutClient from './AdminLayoutClient';
import { AuthService } from '@/lib/services/AuthService';
import { headers } from 'next/headers'; // 追加

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. 現在のURLを取得して、ログイン画面かどうかを判定
  const headerList = await headers();
  const fullPath = headerList.get('x-url') || ''; 
  // ※もし x-url が設定されていない環境なら、AdminLayoutClient側で判定するのが確実です。
  
  // 2. ユーザー名を取得
  const authService = new AuthService();
  const displayName = await authService.getCurrentDisplayName();

  return (
    <AdminLayoutClient initialUserName={displayName}>
      {children}
    </AdminLayoutClient>
  );
}