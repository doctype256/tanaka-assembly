// app/admin/contacts/AdminContactsClient.tsx
"use client";

import Link from 'next/link';
import { 
  HiChevronRight, HiOutlineInbox, HiOutlineMail,
  HiOutlineClock, HiOutlineUserCircle, HiHome
} from 'react-icons/hi';
import AdminHeader from '@/app/components/AdminHeader';
import { useAdminContacts } from './useAdminContacts';

export default function AdminContactsClient({ displayName }: { displayName: string }) {
  const { contacts, loading, refresh } = useAdminContacts();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#020617] font-sans">
      {/* 🟢 共通ヘッダー */}
      <AdminHeader 
        title="お問い合わせ履歴" 
        userName={displayName}
        onRefresh={refresh} 
        loading={loading} 
      />

      <main className="p-8 md:p-12 lg:p-16 max-w-7xl w-full mx-auto">
        
        {/* 🟢 パンくずリスト */}
        <nav className="flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 uppercase mb-8" aria-label="現在位置">
          <Link href="/admin" className="hover:text-[#020617] transition-colors flex items-center gap-1 font-bold">
            <HiHome size={14} /> 管理者トップ
          </Link>
          <HiChevronRight size={14} className="text-slate-300" />
          <span className="text-[#EAB308] font-bold">お問い合わせ履歴</span>
        </nav>

        {/* タイトル & 統計 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#EAB308] text-xs font-black tracking-[0.3em] uppercase mb-2">Customer Inquiry</p>
            <h1 className="text-4xl md:text-5xl font-black text-[#020617] tracking-tighter">
              お問い合わせ履歴
            </h1>
            <div className="h-1.5 w-24 bg-[#EAB308] mt-6 rounded-full"></div>
          </div>
          
          <div className="bg-[#020617] text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border-b-4 border-[#EAB308]">
            <div className="p-3 bg-white/10 rounded-2xl text-[#EAB308]">
              <HiOutlineInbox size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Received</p>
              <p className="text-2xl font-black tracking-tighter">
                {contacts.length} <span className="text-xs ml-1 text-slate-400 font-bold uppercase">Inquiries</span>
              </p>
            </div>
          </div>
        </div>

        {/* 🟢 コンテンツエリア */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-32 text-center flex flex-col items-center gap-4 bg-slate-50/30">
              <div className="w-16 h-16 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading inquiries...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-32 text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border-2 border-slate-100">
                <HiOutlineInbox size={48} />
              </div>
              <div className="space-y-1">
                <p className="text-[#020617] font-black text-xl">受信トレイは空です</p>
                <p className="text-slate-400 font-bold text-sm">現在、新しいお問い合わせはありません。</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">受信日時</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">送信者情報</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">メッセージ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-10 py-10 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2 text-[#020617] font-black text-sm tabular-nums">
                          <HiOutlineClock className="text-[#EAB308]" />
                          {new Date(contact.created_at).toLocaleString('ja-JP', {
                            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-10 py-10 align-top min-w-[280px]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#020617] group-hover:text-white transition-colors shadow-sm">
                              <HiOutlineUserCircle size={20} />
                            </div>
                            <span className="font-black text-[#020617] text-lg tracking-tight">{contact.name} 様</span>
                          </div>
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="inline-flex items-center gap-2 text-xs font-black text-[#EAB308] hover:text-[#020617] transition-colors pl-10 underline decoration-slate-200 underline-offset-4"
                          >
                            <HiOutlineMail size={16} />
                            {contact.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-10 py-10 align-top">
                        <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-transparent group-hover:border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
                          <p className="text-sm text-[#020617] font-medium whitespace-pre-wrap leading-[1.8] tracking-tight">
                            {contact.message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <div className="h-20"></div>
    </div>
  );
}