// directory: app/consultation/page.tsx
"use client";

import React, { useState, useEffect } from 'react';

// 選択肢の定義
const QUESTIONS = {
  target: ["子供関連", "その他", "提案やお問い合わせの方はこちら"],
  place: ["学校関連", "役所関連", "家"],
  content: ["お金", "相続", "気持ち", "その他"]
};

// 保存用キーの定数化
const STORAGE_KEY = 'consultation_form_draft';

/**
 * ステップ形式の相談フォーム
 * 全ステップ共通の注釈および「やり直し機能」を統合。
 */
export default function TestConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期データ構造
  const initialFormData = {
    target_type: '',
    place_type: '未選択（スキップ）',
    content_type: '未選択（スキップ）',
    needs_reply: false,
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // 1. マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { savedStep, savedData } = JSON.parse(saved);
        setStep(savedStep || 1);
        setFormData(savedData);
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. 自動保存
  useEffect(() => {
    if (isInitialized && step < 7) {
      const draft = {
        savedStep: step,
        savedData: formData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formData, step, isInitialized]);

  /**
   * フォームをリセットして最初に戻る
   */
  const handleReset = () => {
    if (confirm("入力内容をすべて消去して、最初からやり直しますか？")) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormData);
      setStep(1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus('送信中...');
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus(`✅ 送信完了: ありがとうございました。`);
        localStorage.removeItem(STORAGE_KEY);
        setStep(7);
        window.parent.postMessage('CONSULTATION_SUBMITTED', '*');
      } else {
        const result = await response.json();
        setStatus(`❌ エラー: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ 通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {step <= 6 && (
        <div style={{ marginBottom: '20px', fontSize: '12px', color: '#666' }}>
          進捗: {Math.round((step / 6) * 100)}%
          <div style={{ width: '100%', height: '4px', background: '#eee', marginTop: '5px' }}>
            <div style={{ width: `${(step / 6) * 100}%`, height: '100%', background: '#2d3748', transition: '0.3s' }}></div>
          </div>
        </div>
      )}

      <div style={{ minHeight: '350px' }}>
        {step === 1 && (
          <div>
            <h2>Q1. 何についての相談ですか？</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {QUESTIONS.target.map((opt) => {
                const isSpecial = opt === "提案やお問い合わせの方はこちら";
                return (
                  <button 
                    key={opt} 
                    onClick={() => {
                      setFormData({ ...formData, target_type: opt });
                      isSpecial ? setStep(6) : nextStep();
                    }} 
                    style={{
                      ...buttonStyle,
                      marginTop: isSpecial ? '40px' : '0px',
                      backgroundColor: isSpecial ? '#f8f9fa' : '#fff',
                      borderColor: isSpecial ? '#cbd5e0' : '#ddd'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>Q2. 場所や対象はどこですか？</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {QUESTIONS.place.map(opt => (
                <button key={opt} onClick={() => { setFormData({...formData, place_type: opt}); nextStep(); }} style={buttonStyle}>{opt}</button>
              ))}
              <button onClick={prevStep} style={backLinkStyle}>戻る</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2>Q3. 悩みのジャンルを教えてください</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {QUESTIONS.content.map(opt => (
                <button key={opt} onClick={() => { setFormData({...formData, content_type: opt}); nextStep(); }} style={buttonStyle}>{opt}</button>
              ))}
              <button onClick={prevStep} style={backLinkStyle}>戻る</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2>Q4. 返信を希望されますか？</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setFormData({...formData, needs_reply: true}); nextStep(); }} style={buttonStyle}>希望する</button>
              <button onClick={() => { setFormData({...formData, needs_reply: false}); setStep(6); }} style={buttonStyle}>不要</button>
            </div>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2>Q5. 返信先のメールアドレス</h2>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" style={inputStyle} />
            <button onClick={nextStep} disabled={!formData.email} style={nextButtonStyle}>次へ</button>
            <button onClick={prevStep} style={backLinkStyle}>戻る</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2>詳細をご記入ください</h2>
            <div style={{ marginBottom: '10px', padding: '10px', background: '#edf2f7', borderRadius: '5px', fontSize: '14px' }}>
              選択内容：<strong>{formData.target_type}</strong>
            </div>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="具体的な内容をご記入ください" style={{...inputStyle, height: '150px'}} />
            <button onClick={handleSubmit} disabled={loading || !formData.message} style={nextButtonStyle}>
              {loading ? '送信中...' : 'この内容で送信する'}
            </button>
            <button 
              onClick={() => {
                if (formData.target_type === "提案やお問い合わせの方はこちら") {
                  setStep(1);
                } else {
                  formData.needs_reply ? setStep(5) : setStep(4);
                }
              }} 
              style={backLinkStyle}
            >
              戻る
            </button>
          </div>
        )}

        {/* 共通フッターエリア（送信完了以外） */}
        {step <= 6 && (
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            {/* ステップ2以降にやり直しボタンを表示 */}
            {step > 1 && (
              <button 
                onClick={handleReset} 
                style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', marginBottom: '10px' }}
              >
                最初からやり直す
              </button>
            )}
            <p style={{ fontSize: '11px', color: '#a0aec0', margin: 0 }}>
              ※入力内容は自動保存されています。
            </p>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>{status}</h2>
            <button 
              onClick={() => window.parent.postMessage('CONSULTATION_SUBMITTED', '*')} 
              style={{...nextButtonStyle, background: '#4a5568'}}
            >
              ウィンドウを閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = { padding: '15px', fontSize: '16px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left', width: '100%', backgroundColor: '#fff' };
const nextButtonStyle: React.CSSProperties = { width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px', boxSizing: 'border-box' };
const backLinkStyle: React.CSSProperties = { marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' };