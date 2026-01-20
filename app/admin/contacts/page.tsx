export const dynamic = 'force-dynamic';

import { AuthService } from '@/lib/services/AuthService';
import AdminContactsClient from './AdminContactsClient';

export default async function AdminContactsPage() {
  // 1. サーバーサイドで認証サービスを呼び出し
  const authService = new AuthService();
  
  // 2. ログインユーザーの表示名を取得
  const displayName = await authService.getCurrentDisplayName();

  // 3. 取得した名前をクライアントコンポーネントに渡して表示
  return <AdminContactsClient displayName={displayName} />;
}