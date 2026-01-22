"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HiOutlineCollection, HiOutlineMail, HiMenuAlt2, HiX, HiHome, HiOutlineExternalLink, HiUserCircle 
} from 'react-icons/hi';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  initialUserName: string;
}

export default function AdminLayoutClient({ children, initialUserName }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🔴 サイドバーを表示「させない」条件を定義
  // 1. ログイン画面である (/admin/login)
  // 2. もしくは、URLが /admin で始まっていない (一般公開ページ)
  const isNoSidebarPage = pathname === '/admin/login' || !pathname.startsWith('/admin');

  // 🔴 サイドバーを出さないページの場合は、中身(children)だけをシンプルに返す
  if (isNoSidebarPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // --- これ以降は /admin 以下の「管理画面」専用のレイアウト ---

  const NavLink = ({ href, icon: Icon, children, target }: any) => {
    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
    return (
      <Link 
        href={href} target={target}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center gap-3 px-5 py-4 rounded-xl font-black text-sm transition-all ${
          isActive ? 'bg-[#EAB308] text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#020617] overflow-x-hidden font-sans">
      {/* モバイルメニューボタン */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        className="fixed top-5 left-5 z-[60] p-3 bg-[#020617] rounded-xl md:hidden text-white border border-slate-700 shadow-xl"
      >
        {isMenuOpen ? <HiX size={24} /> : <HiMenuAlt2 size={24} />}
      </button>

      {/* サイドバー */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2 text-white">
            <div className="w-8 h-8 bg-[#EAB308] rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <HiHome size={18} />
            </div>
            <h2 className="text-xl font-black italic tracking-tight uppercase">Admin</h2>
          </div>
        </div>

        <nav className="px-6 space-y-3 flex-1 overflow-y-auto">
          <div className="pb-4 mb-4 border-b border-slate-800/50">
            <p className="px-5 mb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">Menu</p>
            <NavLink href="/admin" icon={HiHome}>ダッシュボード</NavLink>
            <NavLink href="/admin/records" icon={HiOutlineCollection}>実績管理</NavLink>
            <NavLink href="/admin/contacts" icon={HiOutlineMail}>お問い合わせ</NavLink>
          </div>
          <NavLink href="/" icon={HiOutlineExternalLink} target="_blank">サイトを確認</NavLink>
        </nav>

        {/* ログインユーザー情報 */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-3 px-2">
            <HiUserCircle size={24} className="text-slate-500" />
            <div className="flex flex-col min-w-0">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none mb-1">Login As</p>
              <p className="text-xs font-black text-slate-200 truncate">{initialUserName || '管理者'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* モバイル用背景オーバーレイ */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md z-40 md:hidden" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
    </div>
  );
}