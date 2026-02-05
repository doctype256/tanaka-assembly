'use client';

import { useState } from 'react';
import APIClient from '@/lib/apiClient';

export default function ContactPage() {
  const api = new APIClient();

  const [name, setName] = useState('');
  const [furigana, setFurigana] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      await api.createContact(name, furigana, email, message);
      setSuccess(true);
    } catch (err) {
      alert('送信中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">送信が完了しました</h1>
        <p>お問い合わせありがとうございます。</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">お名前</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">ふりがな</label>
          <input
            className="border p-2 w-full"
            value={furigana}
            onChange={(e) => setFurigana(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">お問い合わせ内容</label>
          <textarea
            className="border p-2 w-full"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {sending ? '送信中…' : '送信する'}
        </button>
      </form>
    </div>
  );
}
