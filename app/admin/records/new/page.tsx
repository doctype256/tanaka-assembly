export const dynamic = 'force-dynamic';

import { AuthService } from '@/lib/services/AuthService';
import NewRecordClient from './NewRecordClient';

export default async function NewRecordPage() {
  // サーバーサイドで名前を取得
  const authService = new AuthService();
  const displayName = await authService.getCurrentDisplayName();

  // クライアントコンポーネントを呼び出し、名前をプロップスで渡す
  return <NewRecordClient displayName={displayName} />;
}