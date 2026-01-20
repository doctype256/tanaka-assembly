"use client";

import { useState } from "react";

const sns = { 
    x: "https://x.com/your_x_account", 
    instagram: "https://www.instagram.com/syunsuke_0522?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    linkedin: "https://www.linkedin.com/in/your_linkedin_account", 
  };

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーボタン */}
      <button className="humbergerbutton"
        onClick={() => setOpen(!open)}
       aria-label="メニュー切り替え"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* オーバーレイ（背景） */}
      {open && (
        <div className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* スライドメニュー */}
        <nav className={`menu ${open ? "open" : ""}`}>
            <ul className="menulist">
                <li><a href="/">トップページ</a></li>
                <li><a href="/history">過去の歴史</a></li>
                <li><a href="/blog">ブログ</a></li>
                <li><a href="/contact">お問い合わせ</a></li>
                <li><a href={sns.x} target="_blank" rel="noopener noreferrer">X</a></li>
                <li><a href={sns.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href={sns.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
        </nav>
    </>
  );
}
