"use client";

import React from 'react';
import { HiRefresh, HiUserCircle, HiLogout } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

// 🟢 型定義を拡張して loading と userName を受け取れるようにする
interface AdminHeaderProps {
  title: string;
  userName?: string;        // 追加
  onRefresh?: () => void;   // 既存（ダッシュボード用）
  loading?: boolean;        // 追加（ダッシュボード用）
}

export default function AdminHeader({ 
  title, 
  userName = "Guest",      // デフォルト値を設定
  onRefresh, 
  loading = false 
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    }
  };

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50 shadow-sm px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-[#EAB308] rounded-full"></div>
          <h2 className="text-xl font-black text-[#020617] tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* 更新ボタン（ダッシュボード用） */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`p-2.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-[#EAB308] hover:border-[#EAB308] transition-all
                ${loading ? 'animate-spin border-[#EAB308] text-[#EAB308]' : ''}`}
            >
              <HiRefresh size={20} />
            </button>
          )}

          {/* ユーザー情報エリア */}
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-inner">
            <HiUserCircle size={24} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-0.5">Admin User</span>
              <span className="text-sm font-black text-[#020617] leading-none">
                {userName} 様
              </span>
            </div>
          </div>

          {/* ログアウトボタン */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl border-2 border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all"
            title="ログアウト"
          >
            <HiLogout size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}