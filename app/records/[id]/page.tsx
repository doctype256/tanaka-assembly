export const dynamic = 'force-dynamic';

import { getDbClient } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { 
  HiOutlineChevronLeft, 
  HiOutlineCalendar, 
  HiOutlineTag,
  HiOutlineHome,
  HiOutlineChevronRight
} from 'react-icons/hi';
import Navigation from '../../components/Navigation';

interface RecordDetailPageProps {
  params: { id: string };
}

interface RecordItem {
  id: number;
  title: string;
  content: string;
  record_date: string;
  category: string | null;
}

// Params解決用のヘルパー
async function getParams(params: RecordDetailPageProps['params']) {
    return await params; 
}

async function getRecordById(id: string): Promise<RecordItem | null> {
  if (isNaN(Number(id))) return null;
  try {
    const db = getDbClient();
    const result = await db.execute({
      sql: `SELECT id, title, content, record_date, category 
            FROM records 
            WHERE id = ? AND is_published = 1`,
      args: [id],
    });
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      record_date: row.record_date as string,
      category: row.category as string | null,
    };
  } catch (error) {
    console.error("❌ データ取得エラー:", error);
    return null;
  }
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  const resolvedParams = await getParams(params); 
  const recordId = resolvedParams.id;
  
  if (!recordId) notFound();
  const record = await getRecordById(recordId);
  if (!record) notFound();
  
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5C544E] font-sans selection:bg-[#F3E5E3]">
      
      {/* 1. ヘッダー（共通ナビゲーション） */}
      <Navigation />

      <main className="pt-32 pb-24 px-6">
        {/* 2. パンくずリスト */}
        <nav className="max-w-3xl mx-auto mb-12 flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#B5ADA5] uppercase">
          <Link href="/" className="hover:text-[#8E7D73] flex items-center gap-1">
            <HiOutlineHome className="mb-0.5" /> HOME
          </Link>
          <HiOutlineChevronRight size={10} />
          <Link href="/records" className="hover:text-[#8E7D73]">活動記録</Link>
          <HiOutlineChevronRight size={10} />
          <span className="text-[#8E7D73] truncate">記事詳細</span>
        </nav>

        {/* 3. 記事コンテンツエリア */}
        <article className="max-w-3xl mx-auto">
          {/* 記事ヘッダー */}
          <header className="mb-12 border-b border-[#F2EDE9] pb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#C5A59E] tracking-widest">
                <HiOutlineCalendar size={16} />
                {record.record_date}
              </span>
              {record.category && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E7D73] bg-[#F3E5E3]/40 px-3 py-1 rounded-full border border-[#F3E5E3]">
                  <HiOutlineTag size={14} />
                  {record.category}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A443F] leading-[1.4] tracking-tight">
              {record.title}
            </h1>
          </header>

          {/* 記事本文 */}
          <div className="bg-white p-8 md:p-16 rounded-[3rem] border border-[#F2EDE9] shadow-sm">
            <div className="prose prose-stone max-w-none text-[#5C544E] leading-[2.1] text-lg font-light whitespace-pre-wrap">
              {record.content}
            </div>
          </div>

          {/* フッターリンク */}
          <div className="mt-16 text-center">
            <Link 
              href="/records" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-white border border-[#F2EDE9] text-[#8E7D73] rounded-full text-sm font-bold tracking-widest hover:bg-[#FDFBF9] hover:border-[#C5A59E] transition-all shadow-sm"
            >
              <HiOutlineChevronLeft />
              一覧に戻る
            </Link>
          </div>
        </article>
      </main>

      {/* 4. フッター（共通） */}
      <footer className="bg-[#F2EDE9] py-16 text-center">
        <p className="font-serif text-xl text-[#8E7D73] mb-8 tracking-[0.2em]">中条 俊介 ポートフォリオ</p>
        <p className="text-[10px] text-[#CDC7BD] tracking-[0.2em]">© {new Date().getFullYear()} SHUNSUKE NAKAJO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}