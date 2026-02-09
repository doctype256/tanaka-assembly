// directory: app/consultation/page.tsx
"use client";

import React, { useState } from 'react';

// 選択肢の定義（表示順を整理）
const QUESTIONS = {
  target: ["子供関連", "その他", "提案やお問い合わせの方はこちら"],
  place: ["学校関連", "役所関連", "家"],
  content: ["お金", "相続", "気持ち", "その他"]
};

/**
 * ステップ形式の相談フォーム（配置調整版）
 */
export default function TestConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const [formData, setFormData] = useState({
    target_type: '',
    place_type: '未選択（スキップ）',
    content_type: '未選択（スキップ）',
    needs_reply: false,
    email: '',
    message: ''
  });

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
      const result = await response.json();
      if (response.ok) {
        setStatus(`✅ 送信完了: ありがとうございました。`);
        setStep(7);
      } else {
        setStatus(`❌ エラー: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ 通信エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

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
        {/* ステップ1: ターゲット選択（配置調整） */}
        {step === 1 && (
          <div>
            <h2>Q1. 何についての相談ですか？</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {QUESTIONS.target.map((opt, index) => {
                // 「提案やお問い合わせの方はこちら」の場合のスタイル調整
                const isSpecial = opt === "提案やお問い合わせの方はこちら";
                
                return (
                  <button 
                    key={opt} 
                    onClick={() => {
                      setFormData({ ...formData, target_type: opt });
                      if (isSpecial) {
                        setStep(6);
                      } else {
                        nextStep();
                      }
                    }} 
                    style={{
                      ...buttonStyle,
                      marginTop: isSpecial ? '40px' : '0px', // 2段ほど下げるための余白
                      backgroundColor: isSpecial ? '#f8f9fa' : '#fff', // 少し色を変えて区別
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

        {/* ステップ2〜5 は変更なし（前回のロジックを維持） */}
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

        {/* ステップ6: 詳細メッセージ */}
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

        {step === 7 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>{status}</h2>
            <button onClick={() => window.location.reload()} style={{...nextButtonStyle, background: '#4a5568'}}>トップへ戻る</button>
          </div>
        )}
      </div>
    </div>
  );
}

// スタイル定義
const buttonStyle: React.CSSProperties = { padding: '15px', fontSize: '16px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left', width: '100%' };
const nextButtonStyle: React.CSSProperties = { width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px', boxSizing: 'border-box' };
const backLinkStyle: React.CSSProperties = { marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' };