// directory: components/ConsultationFloatButton.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';

/**
 * ConsultationFloatButton クラス
 * インラインスタイルのみを使用して TypeScript の型エラーを回避した完全版
 */
export default function ConsultationFloatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'CONSULTATION_SUBMITTED') {
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [closeModal]);

  if (!mounted) return null;

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
      alignItems: 'center',
      transition: 'transform 0.2s ease',
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
      width: '95%',
      maxWidth: '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      // アニメーションは標準的なCSSクラスを使わない場合、このように定義可能
      animation: 'modalFadeIn 0.3s ease-out'
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
      height: '600px',
      border: 'none'
    }
  };

  return (
    <>
      {/* Keyframes を TypeScript エラーなしで挿入するため、
        dangerouslySetInnerHTML を使用して標準の style タグとして扱います。
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

      <button
        type="button"
        onClick={openModal}
        style={styles.button}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
      >
        📮
      </button>

      {isOpen && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>ご相談フォーム</span>
              <button 
                type="button"
                onClick={closeModal} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                ×
              </button>
            </div>
            <iframe src="/consultation" style={styles.iframe} title="consultation-form" />
          </div>
        </div>
      )}
    </>
  );
}