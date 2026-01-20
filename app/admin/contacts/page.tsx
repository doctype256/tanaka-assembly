"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlineRefresh } from 'react-icons/hi';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      
      // データが配列であることを確認してからセット
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        console.error("取得データが配列ではありません:", data);
        setContacts([]);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-indigo-600 flex items-center gap-1 text-sm mb-2 hover:underline">
              <HiOutlineArrowLeft /> ダッシュボードへ戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <HiOutlineMail className="text-indigo-500" />
              お問い合わせ管理
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchContacts}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
              title="再読み込み"
            >
              <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
            </button>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold">
              合計 {contacts.length} 件
            </span>
          </div>
        </div>

        {/* テーブル表示エリア */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-500 font-medium">データを読み込み中...</div>
          ) : contacts.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-400 mb-2 text-lg">お問い合わせはまだありません。</p>
              <p className="text-sm text-gray-300">フォームからの送信を待機しています。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">受信日時</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">差出人</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">メッセージ内容</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(contact.created_at).toLocaleString('ja-JP')}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800 text-sm">{contact.name}</div>
                        <div className="text-xs text-indigo-500 truncate max-w-[150px]">
                          <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-none whitespace-pre-wrap leading-relaxed">
                          {contact.message}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}