// Server Component
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getDbClient } from '@/lib/db';
import { 
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineTag
} from 'react-icons/hi';
// ナビゲーション用のクライアントコンポーネントをインポート（後述）
import Navigation from '../components/Navigation'; 

interface RecordItem {
  id: number;
  title: string;
  content: string;
  record_date: string;
  category: string | null;
  is_published: number;
}

async function getPublishedRecords(): Promise<RecordItem[]> {
  try {
    const db = getDbClient();
    const result = await db.execute(`
      SELECT id, title, record_date, category 
      FROM records 
      WHERE is_published = 1 
      ORDER BY record_date DESC
    `);

    return result.rows.map(row => ({
        id: row.id as number,
        title: row.title as string,
        record_date: row.record_date as string,
        category: row.category as string | null,
        content: '',
        is_published: 1,
    }));
  } catch (error) {
    console.error("❌ データ取得エラー:", error);
    return [];
  }
}

export default async function RecordsPage() {
  const records = await getPublishedRecords();

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5C544E] font-sans selection:bg-[#F3E5E3]">
      
      {/* 1. ヘッダー（ナビゲーション） */}
      {/* ※再利用性を高めるため、Navigationコンポーネントとして分離することを推奨します */}
      <Navigation />

      <main className="pt-32 pb-20">
        {/* 2. パンくずリスト */}
        <nav className="max-w-5xl mx-auto px-6 mb-12 flex items-center gap-2 text-[12px] font-bold tracking-wider text-[#B5ADA5]">
          <Link href="/" className="hover:text-[#8E7D73] flex items-center gap-1">
            <HiOutlineHome className="mb-0.5" /> ホーム
          </Link>
          <HiOutlineChevronRight size={10} />
          <span className="text-[#8E7D73]">活動記録</span>
        </nav>

        <div className="max-w-5xl mx-auto px-6">
          {/* 3. ページタイトル */}
          <header className="mb-16 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A443F] tracking-widest mb-4">
              活動記録
            </h1>
            <p className="text-[#A39C94] text-sm tracking-widest">
              日々の制作や、大切にしている活動のアーカイブ
            </p>
          </header>

          {/* 4. 記録一覧 */}
          {records.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-[#F2EDE9]">
              <p className="text-[#B5ADA5]">現在、公開されている記事はありません。</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {records.map((record) => (
                <Link 
                  key={record.id} 
                  href={`/records/${record.id}`}
                  className="group bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#F2EDE9] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#C5A59E] tracking-widest uppercase bg-[#FDFBF9] px-3 py-1 rounded-full border border-[#F3E5E3]">
                        <HiOutlineCalendar size={14} />
                        {record.record_date}
                      </span>
                      {record.category && (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#B5ADA5] tracking-widest uppercase">
                          <HiOutlineTag size={14} />
                          {record.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4A443F] group-hover:text-[#8E7D73] transition-colors leading-snug">
                      {record.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#C5A59E] font-bold text-sm tracking-widest">
                    本文を読む
                    <div className="w-8 h-8 rounded-full bg-[#FDFBF9] border border-[#F2EDE9] flex items-center justify-center group-hover:bg-[#C5A59E] group-hover:text-white transition-all">
                      <HiOutlineChevronRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. フッター */}
      <footer className="bg-[#F2EDE9] py-16 px-6 text-center">
        <p className="font-serif text-xl text-[#8E7D73] mb-8 tracking-[0.2em]">中条 俊介 ポートフォリオ</p>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold tracking-widest text-[#B5ADA5] mb-8">
          <Link href="/" className="hover:text-[#8E7D73]">ホーム</Link>
          <Link href="/records" className="hover:text-[#8E7D73]">活動記録</Link>
          <Link href="/contact" className="hover:text-[#8E7D73]">お問い合わせ</Link>
          <Link href="/admin" className="hover:text-[#8E7D73]">管理者用</Link>
        </nav>
        <p className="text-[10px] text-[#CDC7BD] tracking-[0.2em]">© {new Date().getFullYear()} SHUNSUKE NAKAJO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}