// Server Component
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { getDbClient } from '@/lib/db';
import { 
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlinePhotograph
} from 'react-icons/hi';
import Navigation from '../components/Navigation'; 

interface RecordItem {
  id: number;
  title: string;
  record_date: string;
  category: string | null;
  image_url: string | null; // 画像カラムを追加
}

async function getPublishedRecords(): Promise<RecordItem[]> {
  try {
    const db = getDbClient();
    const result = await db.execute(`
      SELECT id, title, record_date, category, image_url 
      FROM records 
      WHERE is_published = 1 
      ORDER BY record_date DESC
    `);

    return result.rows.map(row => ({
        id: row.id as number,
        title: row.title as string,
        record_date: row.record_date as string,
        category: row.category as string | null,
        image_url: row.image_url as string | null,
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
      
      <Navigation />

      <main className="pt-32 pb-24">
        {/* 2. パンくずリスト */}
        <nav className="max-w-6xl mx-auto px-6 mb-12 flex items-center gap-2 text-[12px] font-bold tracking-wider text-[#B5ADA5]">
          <Link href="/" className="hover:text-[#8E7D73] flex items-center gap-1">
            <HiOutlineHome className="mb-0.5" /> ホーム
          </Link>
          <HiOutlineChevronRight size={10} />
          <span className="text-[#8E7D73]">活動記録</span>
        </nav>

        <div className="max-w-6xl mx-auto px-6">
          {/* 3. ページタイトルエリア */}
          <header className="mb-20 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4A443F] tracking-[0.2em] mb-6">
              RECORDS
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="w-8 h-[1px] bg-[#C5A59E]"></span>
              <p className="text-[#A39C94] text-xs font-bold tracking-[0.3em] uppercase">
                活動記録
              </p>
              <span className="w-8 h-[1px] bg-[#C5A59E]"></span>
            </div>
            <p className="text-[#B5ADA5] text-sm leading-relaxed max-w-lg mx-auto italic">
              日々の制作や、大切にしている活動、<br className="hidden md:inline" />
              そこから生まれた気づきをアーカイブしています。
            </p>
          </header>

          {/* 4. 記録一覧（グリッドレイアウトへ変更） */}
          {records.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-[#F2EDE9] shadow-sm">
              <HiOutlinePhotograph size={40} className="mx-auto text-[#EBE7E0] mb-4" />
              <p className="text-[#B5ADA5] text-sm tracking-widest">現在、準備中の記事はございません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {records.map((record) => (
                <Link 
                  key={record.id} 
                  href={`/records/${record.id}`}
                  className="group flex flex-col h-full"
                >
                  {/* 画像部分 */}
                  <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-[2rem] bg-[#EBE7E0] shadow-sm">
                    {record.image_url ? (
                      <img 
                        src={record.image_url} 
                        alt={record.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#CDC7BD]">
                        <HiOutlinePhotograph size={48} />
                      </div>
                    )}
                    {/* オーバーレイ装飾 */}
                    <div className="absolute inset-0 bg-[#8E7D73]/0 group-hover:bg-[#8E7D73]/5 transition-colors duration-500" />
                  </div>
                  
                  {/* テキスト情報 */}
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-3">
                      <time className="text-[10px] font-bold tracking-widest text-[#C5A59E] flex items-center gap-1.5 uppercase">
                        <HiOutlineCalendar size={13} className="mb-0.5" />
                        {record.record_date.replace(/-/g, '.')}
                      </time>
                      {record.category && (
                        <span className="text-[10px] font-bold tracking-widest text-[#B5ADA5] flex items-center gap-1.5 uppercase">
                          <HiOutlineTag size={13} className="mb-0.5" />
                          {record.category}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-lg font-serif font-bold text-[#4A443F] group-hover:text-[#8E7D73] transition-colors leading-[1.6] mb-4 line-clamp-2">
                      {record.title}
                    </h2>
                    
                    <div className="mt-auto pt-2">
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#C5A59E] tracking-[0.2em] border-b border-[#F3E5E3] pb-1 group-hover:border-[#C5A59E] transition-all">
                        VIEW MORE
                        <HiOutlineChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. フッター */}
      <footer className="bg-[#F2EDE9] py-20 px-6 text-center border-t border-[#F2EDE9]">
        <p className="font-serif text-xl text-[#8E7D73] mb-10 tracking-[0.2em]">中条 俊介 ポートフォリオ</p>
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-6 text-xs font-bold tracking-[0.2em] text-[#B5ADA5] mb-10 uppercase">
          <Link href="/" className="hover:text-[#8E7D73] transition-colors">Home</Link>
          <Link href="/records" className="hover:text-[#8E7D73] transition-colors text-[#8E7D73]">Records</Link>
          <Link href="/contact" className="hover:text-[#8E7D73] transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-[#8E7D73] transition-colors">Admin</Link>
        </nav>
        <p className="text-[10px] text-[#CDC7BD] tracking-[0.3em] font-sans">© {new Date().getFullYear()} SHUNSUKE NAKAJO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}