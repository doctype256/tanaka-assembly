"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { HiOutlineMenuAlt3, HiOutlineX, HiOutlineChevronRight } from 'react-icons/hi';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-[#F2EDE9]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-serif tracking-widest text-[#8E7D73] font-semibold">
          中条 俊介 ポートフォリオ
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-bold tracking-widest">
          <Link href="/#about" className="hover:text-[#C5A59E] transition-colors">自己紹介</Link>
          <Link href="/records" className="hover:text-[#C5A59E] transition-colors text-[#C5A59E]">活動記録</Link>
          <Link href="/contact" className="hover:text-[#C5A59E] transition-colors">お問い合わせ</Link>
        </nav>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#8E7D73] p-2" aria-label="メニュー">
          {isOpen ? <HiOutlineX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-[#F2EDE9] p-8 md:hidden flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link href="/#about" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">自己紹介 <HiOutlineChevronRight /></Link>
          <Link href="/records" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">活動記録 <HiOutlineChevronRight /></Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium flex items-center justify-between">お問い合わせ <HiOutlineChevronRight /></Link>
        </div>
      )}
    </header>
  );
}