// directory: components/ConsultationFloatButton.tsx
"use client";

import React, { useState, useEffect } from 'react';

/**
 * ConsultationFloatButton クラス（コンポーネント）
 * 画面右下に常駐し、クリック時に相談フォームをモーダルで表示します。
 */
export default function ConsultationFloatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // マウント状態を管理（SSRとクライアントサイドのハイドレーション不一致を防止）
  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドレンダリング時は何も表示しない
  if (!mounted) {
    return null;
  }

  // スタイル定義（カプセル化を意識したインライン定義）
  const styles: { [key: string]: React.CSSProperties } = {
    button: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#ff6b9d',
      color: 'white',
      fontSize: '28px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 10000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10001
    },
    modal: {
      backgroundColor: 'white',
      width: '90%',
      maxWidth: '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    header: {
      padding: '10px 20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fdf2f5'
    },
    iframe: {
      width: '100%',
      height: '550px',
      border: 'none'
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={styles.button}
        aria-label="相談フォームを開く"
      >
        📮
      </button>

      {isOpen && (
        <div 
          style={styles.overlay} 
          onClick={() => setIsOpen(false)}
        >
          <div 
            style={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.header}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>ご相談フォーム</span>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                ×
              </button>
            </div>
            <iframe 
              src="/consultation"
              style={styles.iframe}
              title="consultation-form"
            />
          </div>
        </div>
      )}
    </>
  );
}