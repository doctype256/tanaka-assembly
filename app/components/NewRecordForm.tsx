//app/components/NewRecordForm.tsx

"use client";

import React, { useActionState, useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { createRecord } from '@/app/admin/records/actions';
import { 
  HiOutlineCloudUpload, 
  HiOutlineX, 
  HiOutlineCalendar, 
  HiOutlineDocumentText, 
  HiOutlineTag,
  HiOutlineSave
} from 'react-icons/hi';

export default function NewRecordForm({ initialState }: { initialState: any }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createRecord, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 保存成功時のリダイレクト
  useEffect(() => {
    if (state?.success) {
      router.push('/admin/records');
      router.refresh();
    }
  }, [state?.success, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && fileInputRef.current) {
      setPreview(URL.createObjectURL(file));
      
      // DataTransferを使って、ドロップされたファイルを実際のinputタグに流し込む
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!preview 
  });

  return (
    <form action={formAction} className="space-y-8">
      {/* エラーメッセージ表示 */}
      {state?.message && !state.success && (
        <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-black text-sm">
          {state.message}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 p-8 md:p-12 shadow-sm space-y-10">
        
        {/* 画像アップロードエリア */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
            <HiOutlineCloudUpload size={18} className="text-[#EAB308]" />
            カバー画像
          </label>
          <div {...getRootProps()} className={`relative border-2 border-dashed rounded-[2rem] transition-all cursor-pointer overflow-hidden
              ${isDragActive ? 'border-[#EAB308] bg-yellow-50/30' : 'border-slate-100 bg-slate-50 hover:border-[#EAB308]/50'}
          `}>
            {/* 💡 name="image" としてファイルを送信 */}
            <input {...getInputProps()} name="image" ref={fileInputRef} />
            
            {!preview ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#EAB308] shadow-sm">
                  <HiOutlineCloudUpload size={32} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#020617]">画像をドラッグ＆ドロップ</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full group">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-4 bg-white text-rose-500 rounded-full shadow-xl transform hover:scale-110 transition-transform"
                  >
                    <HiOutlineX size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* テキスト入力項目 */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              <HiOutlineDocumentText size={18} className="text-[#EAB308]" />
              タイトル
            </label>
            <input 
              name="title" 
              required 
              placeholder="活動のタイトルを入力" 
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#EAB308] focus:bg-white transition-all font-bold" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                <HiOutlineCalendar size={18} className="text-[#EAB308]" />
                実施日
              </label>
              <input 
                name="record_date" 
                type="date" 
                required 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#EAB308] focus:bg-white transition-all font-bold" 
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                <HiOutlineTag size={18} className="text-[#EAB308]" />
                カテゴリ
              </label>
              <input 
                name="category" 
                placeholder="例: 実績, お知らせ" 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#EAB308] focus:bg-white transition-all font-bold" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              <HiOutlineDocumentText size={18} className="text-[#EAB308]" />
              活動内容
            </label>
            <textarea 
              name="content" 
              rows={6} 
              required 
              placeholder="活動内容を詳しく記述してください..." 
              className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-[#EAB308] focus:bg-white transition-all font-medium resize-none leading-relaxed" 
            />
          </div>

          {/* 公開スイッチ */}
          <div className="flex items-center justify-between p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem]">
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#020617]">公開ステータス</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Post immediately to public site</span>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="is_published" 
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#EAB308] shadow-inner"></div>
              <span className="ml-3 text-xs font-black text-[#020617] w-12">
                {isPublished ? '公開' : '下書き'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-12 py-5 bg-[#020617] text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-[#EAB308] hover:text-black transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
        >
          {isPending ? (
             <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <HiOutlineSave size={24} />
              活動記録を保存する
            </>
          )}
        </button>
      </div>
    </form>
  );
}