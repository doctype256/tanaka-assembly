// app/admin/AdminDashboardClient.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  HiOutlineCollection, 
  HiOutlineMail, 
  HiOutlineExternalLink,
  HiChevronRight,
  HiHome
} from 'react-icons/hi';
import AdminHeader from '@/app/components/AdminHeader';
import { AdminStatsService } from '@/lib/services/AdminStatsService';
import { Stats } from '@/lib/domain/Stats';

// 🟢 受け取るデータの型を定義
interface AdminDashboardClientProps {
  initialUserName: string;
}

export default function AdminDashboardClient({ initialUserName }: AdminDashboardClientProps) {
  const statsService = useMemo(() => new AdminStatsService(), []);
  const [stats, setStats] = useState<Stats>(new Stats(0, 0));
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const data = await statsService.getDashboardStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <AdminHeader 
        title="ダッシュボード" 
        onRefresh={fetchStats} 
        loading={loading} 
        userName={initialUserName} // 🟢 サーバーから届いた名前を反映！
      />

      <main className="p-8 md:p-12 lg:p-16 max-w-6xl w-full mx-auto">
        
        {/* パンくずリスト */}
        <nav className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 uppercase mb-8">
          <Link href="/admin" className="hover:text-[#020617] transition-colors flex items-center gap-1">
            <HiHome size={14} /> 管理者トップ
          </Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <span className="text-[#EAB308]">ダッシュボード</span>
        </nav>

        {/* タイトルセクション */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-4 border-[#EAB308] pb-8">
          <div>
            <h1 className="text-5xl font-black text-[#020617] tracking-tighter">ダッシュボード</h1>
            <p className="text-slate-600 font-black mt-3 text-base">システム統計と通知のサマリーを確認します。</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 py-3 px-8 bg-[#020617] text-white rounded-xl text-xs font-black hover:bg-[#EAB308] hover:text-[#000000] transition-all shadow-xl">
            サイトを表示 <HiOutlineExternalLink size={16} />
          </Link>
        </div>

        {/* 統計カードセクション */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
          <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-200 shadow-sm flex justify-between items-center group hover:border-[#020617] transition-all duration-300">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">公開中の記録</p>
              <h3 className="text-6xl font-black text-[#020617]">
                {loading ? "---" : stats.records}
                <span className="text-xl ml-2 text-slate-400">件</span>
              </h3>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 text-slate-300 group-hover:bg-[#EAB308] group-hover:text-[#000000] transition-all shadow-inner">
              <HiOutlineCollection size={36} />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-200 shadow-sm flex justify-between items-center group hover:border-[#020617] transition-all duration-300">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">お問い合わせ通知</p>
              <h3 className="text-6xl font-black text-[#020617]">
                {loading ? "---" : stats.contacts}
                <span className="text-xl ml-2 text-slate-400">件</span>
              </h3>
              {!loading && stats.hasAlert() && (
                <span className="text-[10px] font-black text-rose-500 animate-pulse">※ 未対応のメッセージがあります</span>
              )}
            </div>
            <div className={`p-6 rounded-3xl bg-slate-50 transition-all shadow-inner 
              ${stats.hasAlert() ? 'text-rose-500 bg-rose-50' : 'text-slate-300 group-hover:bg-[#020617] group-hover:text-white'}`}>
              <HiOutlineMail size={36} />
            </div>
          </div>
        </div>

        {/* クイックリンク */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-200 p-10 md:p-14 shadow-sm">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-12 inline-block border-b-4 border-[#EAB308] pb-1">クイックアクション</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuickLinkItem 
              href="/admin/records" 
              title="記録を管理する" 
              description="実績の投稿と編集" 
              icon={<HiOutlineCollection size={24} />} 
            />
            <QuickLinkItem 
              href="/admin/contacts" 
              title="メッセージを確認" 
              description="お問い合わせの返信管理" 
              icon={<HiOutlineMail size={24} />} 
            />
          </div>
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}

function QuickLinkItem({ href, title, description, icon }: { href: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-[#020617] hover:bg-white transition-all group shadow-sm">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-[#EAB308] shadow-md border border-slate-100">
          {icon}
        </div>
        <div>
          <span className="font-black text-xl text-[#020617]">{title}</span>
          <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider">{description}</p>
        </div>
      </div>
      <HiChevronRight size={28} className="text-slate-300 group-hover:text-[#020617] group-hover:translate-x-2 transition-all" />
    </Link>
  );
}