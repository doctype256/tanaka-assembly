// app/admin/layout.tsx
import AdminLayoutClient from './AdminLayoutClient';
import { AuthService } from '@/lib/services/AuthService';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * 🟢 サーバーサイドで名前を特定
   * ここで取得した displayName は、全ページ共通のサイドバーやヘッダーで使い回せます。
   */
  const authService = new AuthService();
  const displayName = await authService.getCurrentDisplayName();

  return (
    <AdminLayoutClient initialUserName={displayName}>
      {children}
    </AdminLayoutClient>
  );
}