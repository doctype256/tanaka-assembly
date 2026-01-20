// /app/admin/records/new/page.tsx

import Link from 'next/link';
// 💡 Client Component をインポート（パスがご自身の環境と合っているかご確認ください）
import NewRecordForm from '../../../components/NewRecordForm'; 

/**
 * 新規記録作成ページ (Server Component)
 */
export default function NewRecordPage() {

    // useActionState に渡す初期状態を定義
    // EditFormStatus の ActionState 型と整合性を取っています
    const initialState = {
        success: false,
        message: '初期状態',
    };

    return (
        <main className="container mx-auto p-4 md:p-8 max-w-2xl font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                新しい活動記録の作成
            </h1>

            <Link href="/admin/records" className="text-indigo-600 hover:text-indigo-800 text-sm mb-4 inline-block">
                ← 管理一覧に戻る
            </Link>

            {/* フォーム本体を含む Client Component */}
            {/* 編集ページと同じく、余白や構造を統一した NewRecordForm を呼び出します */}
            <div className="mt-4">
                <NewRecordForm initialState={initialState} />
            </div>
        </main>
    );
}