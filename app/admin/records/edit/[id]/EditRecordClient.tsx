//app/admin/records/edit/[id]/EditRecordClient.tsx
//表示専用コンポーネント

"use client";

import Link from 'next/link';
import { HiChevronRight, HiOutlineArrowLeft, HiHome } from 'react-icons/hi';
import AdminHeader from '@/app/components/AdminHeader';
import EditFormStatus from '../../../../components/EditFormStatus'; 
import { useEditRecord } from './useEditRecord';

export default function EditRecordClient({ record, displayName }: any) {
  const { initialState, isSubmitting, handleRefresh } = useEditRecord(record);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#020617] font-sans">
      <AdminHeader 
        title="活動記録の編集" 
        userName={displayName} 
        onRefresh={handleRefresh}
        loading={isSubmitting}
      />

      <main className="p-8 md:p-12 lg:p-16 max-w-4xl w-full mx-auto">
        
        {/* パンくずリスト */}
        <nav className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 uppercase mb-8" aria-label="現在位置">
          <Link href="/admin" className="hover:text-[#020617] transition-colors flex items-center gap-1 font-bold">
            <HiHome size={14} /> 管理者トップ
          </Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <Link href="/admin/records" className="hover:text-[#020617] transition-colors font-bold">
            活動記録の管理
          </Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <span className="text-[#EAB308] font-bold">記事の編集</span>
        </nav>

        {/* タイトルエリア */}
        <div className="mb-12">
          <Link 
            href="/admin/records" 
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#020617] mb-6 group transition-colors"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            管理一覧に戻る
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-[#EAB308] pb-8">
            <div>
              <p className="text-[#EAB308] text-xs font-black tracking-[0.3em] uppercase mb-2">Editor Mode</p>
              <h1 className="text-5xl font-black text-[#020617] tracking-tighter">
                活動記録を編集
              </h1>
              <p className="text-slate-600 font-black mt-3 text-base">
                #{record.id} の情報を修正しています。
              </p>
            </div>
            
            {/* IDバッジ */}
            <div className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5 tracking-wider">Record ID</span>
              <span className="text-xl font-black text-[#020617] tabular-nums">#{record.id}</span>
            </div>
          </div>
        </div>

        {/* フォームエリア */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="max-w-3xl mx-auto">
            {/* 既存のフォームコンポーネントを呼び出し */}
            <EditFormStatus 
                initialState={initialState} 
                recordId={record.id} 
            />
          </div>
        </div>
      </main>

      <div className="h-24"></div>
    </div>
  );
}