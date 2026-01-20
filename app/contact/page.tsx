"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HiOutlineMenuAlt3, 
  HiOutlineX, 
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlinePaperAirplane,
  HiOutlineChevronLeft 
} from "react-icons/hi";

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#5C544E] font-sans selection:bg-[#F3E5E3]">
      
      {/* --- 1. ヘッダー（トップページと共通） --- */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-[#F2EDE9]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-serif tracking-widest text-[#8E7D73] font-semibold">
            中条 俊介 ポートフォリオ
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest">
            <Link href="/#about" className="hover:text-[#C5A59E] transition-colors">自己紹介</Link>
            <Link href="/records" className="hover:text-[#C5A59E] transition-colors">活動記録</Link>
            <Link href="/contact" className="text-[#C5A59E] transition-colors">お問い合わせ</Link>
          </nav>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#8E7D73] p-2" aria-label="メニュー">
            {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
          </button>
        </div>

        {/* スマホ用オーバーレイメニュー */}
        {isOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-[#F2EDE9] p-8 md:hidden flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            <Link href="/#about" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">自己紹介 <HiOutlineChevronRight /></Link>
            <Link href="/records" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">活動記録 <HiOutlineChevronRight /></Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">お問い合わせ <HiOutlineChevronRight /></Link>
          </div>
        )}
      </header>

      {/* --- 2. メインコンテンツ --- */}
      <main className="pt-32 pb-20">
        {/* パンくずリスト */}
        <nav className="max-w-5xl mx-auto px-6 mb-12 flex items-center gap-2 text-[12px] font-bold tracking-wider text-[#B5ADA5]">
          <Link href="/" className="hover:text-[#8E7D73] flex items-center gap-1">
            <HiOutlineHome className="mb-0.5" /> ホーム
          </Link>
          <HiOutlineChevronRight size={10} />
          <span className="text-[#8E7D73]">お問い合わせ</span>
        </nav>

        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] shadow-sm border border-[#F2EDE9] overflow-hidden">
            {/* コンタクトヘッダー */}
            <div className="bg-[#F3E5E3]/30 p-10 text-center border-b border-[#F2EDE9]">
              <h1 className="text-2xl font-serif tracking-widest text-[#4A443F] font-bold">Message</h1>
              <p className="text-[#A39C94] mt-3 text-sm font-medium tracking-wider">
                お仕事のご依頼やご相談、メッセージはこちらから
              </p>
            </div>

            <div className="p-8 md:p-12">
              {status === "success" ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <HiOutlineCheckCircle size={64} className="text-[#A7B8A8] mx-auto mb-6" />
                  <h2 className="text-2xl font-serif text-[#4A443F] font-bold">送信が完了しました</h2>
                  <p className="text-[#7A7167] mt-4 leading-relaxed">
                    ありがとうございます。内容を確認次第、<br />折り返しご連絡させていただきます。
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-10 bg-[#F2EFE9] px-8 py-3 rounded-full text-[#7A7167] font-bold hover:bg-[#EBE7E0] transition-all"
                  >
                    入力画面に戻る
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-[0.2em] text-[#B5ADA5] mb-3 ml-1">
                      お名前
                    </label>
                    <input 
                      id="name"
                      name="name" 
                      type="text" 
                      required 
                      placeholder="例：山田 花子"
                      className="w-full px-5 py-4 rounded-2xl bg-[#FDFBF9] border border-[#F2EDE9] focus:ring-2 focus:ring-[#C5A59E]/20 focus:border-[#C5A59E] outline-none transition text-[#5C544E] placeholder:text-[#CDC7BD]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-[#B5ADA5] mb-3 ml-1">
                      メールアドレス
                    </label>
                    <input 
                      id="email"
                      name="email" 
                      type="email" 
                      required 
                      placeholder="example@mail.com"
                      className="w-full px-5 py-4 rounded-2xl bg-[#FDFBF9] border border-[#F2EDE9] focus:ring-2 focus:ring-[#C5A59E]/20 focus:border-[#C5A59E] outline-none transition text-[#5C544E] placeholder:text-[#CDC7BD]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-black uppercase tracking-[0.2em] text-[#B5ADA5] mb-3 ml-1">
                      メッセージ内容
                    </label>
                    <textarea 
                      id="message"
                      name="message" 
                      required 
                      placeholder="具体的なご相談内容をご記入ください"
                      className="w-full px-5 py-4 rounded-2xl bg-[#FDFBF9] border border-[#F2EDE9] focus:ring-2 focus:ring-[#C5A59E]/20 focus:border-[#C5A59E] outline-none transition h-48 resize-none text-[#5C544E] placeholder:text-[#CDC7BD]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="w-full bg-[#8E7D73] text-white font-bold py-5 rounded-2xl hover:bg-[#7A6A61] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#8E7D73]/10 disabled:bg-[#CDC7BD] active:scale-[0.98]"
                  >
                    {status === "loading" ? "送信しています..." : "上記の内容で送信する"}
                  </button>

                  {status === "error" && (
                    <p className="text-red-500 text-center text-sm font-bold">送信に失敗しました。時間をおいて再度お試しください。</p>
                  )}
                </form>
              )}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#B5ADA5] hover:text-[#8E7D73] transition-colors group">
              <HiOutlineChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>

      {/* --- 3. フッター（トップページと共通） --- */}
      <footer className="bg-[#F2EDE9] py-16 px-6 text-center">
        <p className="font-serif text-xl text-[#8E7D73] mb-8 tracking-[0.2em]">中条 俊介 ポートフォリオ</p>
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold tracking-widest text-[#B5ADA5] mb-8">
          <Link href="/" className="hover:text-[#8E7D73]">ホーム</Link>
          <Link href="/records" className="hover:text-[#8E7D73]">活動記録</Link>
          <Link href="/contact" className="hover:text-[#8E7D73]">お問い合わせ</Link>
          <Link href="/admin" className="hover:text-[#8E7D73]">管理者用</Link>
        </nav>
        <p className="text-[10px] text-[#CDC7BD] tracking-[0.2em]">© {new Date().getFullYear()} SHUNSUKE NAKAJO. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}