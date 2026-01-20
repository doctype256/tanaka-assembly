// /src/app/admin/records/page.tsx

export const dynamic = 'force-dynamic'; // 常に最新のデータを取得

import { getDbClient } from '@/lib/db';
import Link from 'next/link';
// Server Actions と Client Component をインポート
import { togglePublishStatus } from './actions'; 
import DeleteButton from '../../components/DeleteButton';

// 記録データの型定義 (is_published を含む)
interface AdminRecordItem {
  id: number;
  title: string;
  record_date: string;
  is_published: number; // 1:公開, 0:非公開
}

/**
 * データベースから全ての活動記録を取得する関数（管理者用）
 */
async function getAllRecords(): Promise<AdminRecordItem[]> {
  try {
    const db = getDbClient();
    
    // SQL: 全てのレコードを取得 (is_publishedの条件なし)
    const result = await db.execute({
      sql: `SELECT id, title, record_date, is_published 
            FROM records 
            ORDER BY record_date DESC, id DESC`,
      args: [],
    });
    
    return result.rows.map(row => ({
      id: row.id as number,
      title: row.title as string,
      record_date: row.record_date as string,
      is_published: row.is_published as number,
    }));
    
  } catch (error) {
    console.error("❌ 管理者記録データ取得エラー:", error);
    return []; 
  }
}

export default async function AdminRecordsPage() {
  const records = await getAllRecords();

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        活動記録 管理一覧
      </h1>

      <div className="flex justify-end mb-4">
        <Link href="/admin/records/new" className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150">
          新規記録作成
        </Link>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">まだ活動記録はありません。</p>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活動日
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className={record.is_published === 0 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/records/${record.id}`} className="text-indigo-600 hover:text-indigo-900">
                      {record.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.record_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.is_published === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.is_published === 1 ? '公開中' : '非公開'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    
                    {/* 1. 編集リンク (ステップ 2.0.3 で実装) */}
                    <Link 
                      href={`/admin/records/edit/${record.id}`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編集
                    </Link>
                    
                    {/* 2. 公開/非公開切り替えボタン (Server Action) */}
                    <form 
                      action={togglePublishStatus.bind(null, record.id, record.is_published)} 
                      className="inline"
                    >
                        <button type="submit" className="text-gray-600 hover:text-gray-900">
                            {record.is_published === 1 ? '非公開化' : '公開化'}
                        </button>
                    </form>
                    
                    {/* 3. 削除ボタン (Client Component: 警告プロンプトを含む) */}
                    <DeleteButton recordId={record.id} title={record.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}