// app/admin/page.tsx
import AdminDashboardClient from './AdminDashboardClient'; // 表示担当を読み込む
import { AuthService } from '@/lib/services/AuthService';

export default async function AdminDashboardPage() {
  /**
   * 1. サーバーサイドで名前を特定
   * ログインAPIで保存したクッキー（joji）を鍵に、DBから「小林 譲司」を取得します。
   */
  const authService = new AuthService();
  const displayName = await authService.getCurrentDisplayName();

  // 2. 取得した名前を Props としてクライアントコンポーネントへ渡す
  return <AdminDashboardClient initialUserName={displayName} />;
}