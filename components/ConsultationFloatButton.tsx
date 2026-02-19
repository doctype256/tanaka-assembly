"use client";

import React, { useState, useEffect, useCallback } from 'react';

/**
 * ConsultationFloatButton: 浮遊ボタンおよびモーダルウィンドウ
 * スマホでの表示を最適化（はみ出し防止）し、PCでも適切なサイズに調整。
 */
export default function ConsultationFloatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    setMounted(true);

    // ヒント表示を3秒後に開始し、5秒後に非表示
    const showTimer = setTimeout(() => {
      setShowHint(true);
      const hideTimer = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 3000);

    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'CONSULTATION_SUBMITTED') {
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('message', handleMessage);
    };
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
    hint: {
    　position: 'fixed',
  　　bottom: '40px',
  　　right: '110px',
  　　backgroundColor: '#fff8fb',
  　　color: '#d6336c',
  　　padding: '14px 20px',
  　　borderRadius: '16px',
  　　boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
  　　fontSize: '18px',
  　　fontWeight: 'bold',
  　　zIndex: 9999,
  　　animation: 'fadeInOut 5s ease-in-out',
  　　whiteSpace: 'nowrap',
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
      zIndex: 10001,
      // スマホではみ出さないよう、外側にパディングを確保
      padding: '16px',
      boxSizing: 'border-box'
    },
    modal: {
      backgroundColor: 'white',
      // スマホ時は画面幅いっぱい(左右余白除)から、PC時は最大700pxに制限
      width: '100%',
      maxWidth: '700px', 
      height: '80vh',         // 90vhから80vhに下げて圧迫感を軽減
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      animation: 'modalFadeIn 0.3s ease-out',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    header: {
      padding: '12px 20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#4a86c5',
      flexShrink: 0
    },
    iframe: {
      width: '100%',
      flex: 1,
      border: 'none'
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        /* モバイル端末での表示を微調整 */
        @media (max-width: 480px) {
          .modal-responsive {
            height: 85vh !important;
          }
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
      `,
        }}
      />

      {showHint && <div style={styles.hint}>相談をしませんか？</div>}

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
          <div 
            style={styles.modal} 
            className="modal-responsive"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.header}>
              <span style={{ fontWeight: 'bold', color: '#FCFDFE' }}>ご相談フォーム</span>
              <button
                type="button"
                onClick={closeModal} 
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#FCFDFE', lineHeight: 1 }}
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