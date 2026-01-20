// app/admin/records/new/NewRecordClient.tsx
"use client";

import Link from 'next/link';
import { 
  HiOutlineArrowLeft, HiOutlineSave, HiOutlinePhotograph,
  HiOutlineCalendar, HiOutlineDocumentText, HiChevronRight,
  HiOutlineX, HiOutlineTag, HiHome
} from 'react-icons/hi';
import AdminHeader from '@/app/components/AdminHeader';
import { useNewRecord } from './useNewRecord';

export default function NewRecordClient({ displayName }: { displayName: string }) {
  const {
    loading, dragActive, previewUrl, fileInputRef,
    onDrag, onDrop, onFileChange, removeImage, handleSubmit
  } = useNewRecord();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#020617] font-sans">
      <AdminHeader title="活動記録の作成" userName={displayName} onRefresh={async () => {}} />

      <main className="p-8 md:p-12 lg:p-16 max-w-4xl mx-auto">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 uppercase mb-8">
          <Link href="/admin" className="hover:text-[#020617] flex items-center gap-1"><HiHome size={14} /> 管理者トップ</Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <Link href="/admin/records" className="hover:text-[#020617]">活動記録の管理</Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <span className="text-[#EAB308]">新規作成</span>
        </nav>

        {/* ヘッダーエリア */}
        <div className="mb-12">
          <Link href="/admin/records" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#020617] mb-6 group transition-colors">
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 管理一覧に戻る
          </Link>
          <div className="border-b-4 border-[#EAB308] pb-8">
            <p className="text-[#EAB308] text-xs font-black tracking-[0.3em] uppercase mb-2">Create Mode</p>
            <h1 className="text-5xl font-black text-[#020617] tracking-tighter">活動記録を新規作成</h1>
          </div>
        </div>

        {/* メインフォーム */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
            
            {/* タイトル入力 */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                <HiOutlineDocumentText size={18} className="text-[#EAB308]" /> タイトル
              </label>
              <input name="title" type="text" required placeholder="記録のタイトルを入力" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:border-[#EAB308] outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* カテゴリ入力 */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <HiOutlineTag size={18} className="text-[#EAB308]" /> カテゴリ
                </label>
                <input name="category" type="text" placeholder="例: ボランティア" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:border-[#EAB308] outline-none transition-all" />
              </div>
              {/* 日付入力 */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                  <HiOutlineCalendar size={18} className="text-[#EAB308]" /> 実施日
                </label>
                <input name="record_date" type="date" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:border-[#EAB308] outline-none transition-all" />
              </div>
            </div>

            {/* 画像アップロードエリア */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                <HiOutlinePhotograph size={18} className="text-[#EAB308]" /> 活動写真
              </label>
              <div 
                className={`relative h-64 rounded-[2.5rem] border-4 border-dashed transition-all flex justify-center items-center overflow-hidden cursor-pointer ${dragActive ? 'border-[#EAB308] bg-[#EAB308]/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                onDragOver={onDrag} onDragEnter={onDrag} onDragLeave={onDrag} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} name="image" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeImage} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:text-rose-500 transition-colors">
                      <HiOutlineX size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <HiOutlinePhotograph size={48} className="mx-auto mb-4" />
                    <p className="text-sm font-black">画像をドラッグ＆ドロップ、またはクリック</p>
                  </div>
                )}
              </div>
            </div>

            {/* 本文入力 */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                <HiOutlineDocumentText size={18} className="text-[#EAB308]" /> 本文
              </label>
              <textarea name="content" rows={8} required placeholder="活動内容を詳しく入力してください" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 py-6 font-medium focus:border-[#EAB308] outline-none transition-all" />
            </div>

            {/* 公開ステータス */}
            <div className="pt-8 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-sm font-black text-slate-500 uppercase tracking-widest">公開ステータス設定</span>
              <label className="flex items-center gap-4 cursor-pointer">
                <span className="text-sm font-black text-[#020617]">すぐに公開する</span>
                <div className="relative">
                  <input name="is_published" type="checkbox" value="1" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-8 bg-slate-200 peer-checked:bg-[#EAB308] rounded-full transition-all"></div>
                  <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow-sm"></div>
                </div>
              </label>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-16 py-6 bg-[#020617] text-white rounded-[2rem] font-black text-xl hover:bg-[#EAB308] hover:text-[#020617] transition-all shadow-xl active:scale-95 disabled:opacity-50 min-w-[300px]">
              {loading ? "保存中..." : <><HiOutlineSave className="inline mr-2" size={26} /> 記録を保存する</>}
            </button>
          </div>
        </form>
      </main>
      <div className="h-20"></div>
    </div>
  );
}