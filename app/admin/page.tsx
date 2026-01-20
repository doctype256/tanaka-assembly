"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HiOutlineLogout, 
  HiOutlineCollection, 
  HiOutlineMail, 
  HiOutlineUserCircle,
  HiOutlineExternalLink,
  HiRefresh
} from 'react-icons/hi';

export default function AdminDashboard() {
  const router = useRouter();
  // 初期値はローディング中とわかるように null または 0 で管理
  const [stats, setStats] = useState({ records: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);

  // 1. 統計データを取得する関数
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("統計データの取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. 初回レンダリング時に実行
  useEffect(() => {
    fetchStats();
  }, []);

  // 3. ログアウト処理
  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tighter text-indigo-400">Admin Panel</h2>
          <p className="text-xs text-slate-400 mt-1">Portfolio Management</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg transition">
            <HiOutlineCollection size={20} />
            <span>ダッシュボード</span>
          </Link>
          <Link href="/admin/records" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-300">
            <HiOutlineCollection size={20} />
            <span>実績管理</span>
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-slate-300">
            <HiOutlineMail size={20} />
            <span>お問い合わせ</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
            <HiOutlineLogout size={20} />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-gray-600">
            <HiOutlineUserCircle size={24} />
            <span className="font-medium text-sm md:text-base">管理者: joji 様</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchStats} className="text-gray-400 hover:text-indigo-600 p-2 transition">
               <HiRefresh size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <Link href="/" target="_blank" className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
              サイトを表示 <HiOutlineExternalLink />
            </Link>
          </div>
        </header>

        {/* コンテンツエリア */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">ダッシュボード概要</h1>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">公開中の実績</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : `${stats.records} 件`}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <HiOutlineCollection size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">お問い合わせ件数</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : `${stats.contacts} 件`}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                  <HiOutlineMail size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">クイックアクション</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/admin/records" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
              >
                実績を管理する
              </Link>
              <Link 
                href="/admin/contacts" 
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                メッセージを確認
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}