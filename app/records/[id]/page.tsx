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

// Next.js 15の型定義に準拠
interface RecordDetailPageProps {
  params: Promise<{ id: string }>;
}

interface RecordItem {
  id: number;
  title: string;
  content: string;
  record_date: string;
  category: string | null;
  image_url: string | null;
}

/**
 * データベースから特定のレコードを取得する
 */
async function getRecordById(id: string): Promise<RecordItem | null> {
  const numId = Number(id);
  if (isNaN(numId)) return null;

  try {
    const db = getDbClient();
    // image_url を含めて取得。is_publishedのチェックは運用に合わせて調整
    const result = await db.execute({
      sql: `SELECT id, title, content, record_date, category, image_url 
            FROM records 
            WHERE id = ? AND is_published = 1`,
      args: [numId],
    });

    if (result.rows.length === 0) {
      console.log(`[Info] Record ID ${id} not found or unpublished.`);
      return null;
    }

    const row = result.rows[0];
    
    return {
      id: Number(row.id),
      title: String(row.title || '無題'),
      content: String(row.content || ''),
      record_date: String(row.record_date || ''),
      category: row.category ? String(row.category) : null,
      image_url: row.image_url ? String(row.image_url) : null,
    };
  } catch (error) {
    console.error("❌ getRecordById Database Error:", error);
    return null;
  }
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  // Next.js 15 では params を必ず await する必要があります
  const resolvedParams = await params;
  const recordId = resolvedParams.id;
  
  const record = await getRecordById(recordId);
  
  // データがない場合はNext.js標準の404ページを表示
  if (!record) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5C544E] font-sans selection:bg-[#F3E5E3]">
      
      <Navigation />

      <main className="pt-32 pb-24 px-6">
        {/* パンくずリスト */}
        <nav className="max-w-4xl mx-auto mb-12 flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#B5ADA5] uppercase">
          <Link href="/" className="hover:text-[#8E7D73] flex items-center gap-1 transition-colors">
            <HiOutlineHome className="mb-0.5" /> HOME
          </Link>
          <HiOutlineChevronRight size={10} />
          <Link href="/records" className="hover:text-[#8E7D73] transition-colors">活動記録</Link>
          <HiOutlineChevronRight size={10} />
          <span className="text-[#8E7D73] truncate">{record.title}</span>
        </nav>

        <article className="max-w-4xl mx-auto">
          
          {/* ヒーロー画像: 画像がある場合のみ表示 */}
          {record.image_url && (
            <div className="mb-12 overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-xl shadow-stone-200/50 border border-white">
              <img 
                src={record.image_url} 
                alt={record.title}
                className="w-full h-auto aspect-video md:aspect-[21/9] object-cover"
              />
            </div>
          )}

          {/* 記事ヘッダー */}
          <header className="mb-12 border-b border-[#F2EDE9] pb-12">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#C5A59E] tracking-[0.2em]">
                <HiOutlineCalendar size={18} />
                {record.record_date}
              </span>
              {record.category && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#8E7D73] bg-[#F3E5E3]/40 px-4 py-1.5 rounded-full border border-[#F3E5E3]">
                  <HiOutlineTag size={14} />
                  {record.category}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4A443F] leading-[1.3] tracking-tight">
              {record.title}
            </h1>
          </header>

          {/* 記事本文エリア */}
          <div className="relative">
            {/* 装飾用の背景要素 */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#F3E5E3]/30 rounded-full blur-3xl -z-10" />
            
            <div className="bg-white p-8 md:p-20 rounded-[3.5rem] border border-[#F2EDE9] shadow-sm relative overflow-hidden">
              <div className="prose prose-stone max-w-none text-[#5C544E] leading-[2.2] text-lg font-light whitespace-pre-wrap">
                {record.content}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-20 flex justify-center">
            <Link 
              href="/records" 
              className="group inline-flex items-center gap-3 px-12 py-5 bg-white border border-[#F2EDE9] text-[#8E7D73] rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#8E7D73] hover:text-white hover:border-[#8E7D73] transition-all duration-500 shadow-sm shadow-stone-200"
            >
              <HiOutlineChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to List
            </Link>
          </div>
        </article>
      </main>

      {/* フッター */}
      <footer className="bg-[#F2EDE9] py-20 text-center">
        <p className="font-serif text-2xl text-[#8E7D73] mb-8 tracking-[0.3em] uppercase">Shunsuke Nakajo</p>
        <div className="w-12 h-[1px] bg-[#C5A59E] mx-auto mb-8" />
        <p className="text-[10px] text-[#B5ADA5] tracking-[0.2em]">© {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}