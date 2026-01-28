/**
 * ContactManager クラス
 * お問い合わせフォームの管理
 */

import APIClient from './api.js';
import Utils from './utils.js';

class ContactManager {
  constructor() {
    this.api = new APIClient();
  }

  /**
   * お問い合わせフォームの初期化と送信処理
   */
  initializeForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  /**
   * フォーム送信ハンドラー
   */
  async handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const furigana = document.getElementById('furigana').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('フォーム送信:', { name, furigana, email, message });

    try {
      console.log('API リクエスト送信中...');
      await this.api.createContact(name, furigana, email, message);

      console.log('送信成功、リダイレクト中...');
      window.location.href = 'thanks.html?type=contact';
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('contact-form', 'エラーが発生しました。もう一度お試しください。', 0);
    }
  }

  /**
   * ページ情報の読み込みと初期化
   */
  async initializePage() {
    try {
      const response = await fetch('data/static-texts.json');
      const data = await response.json();
      const contact = data.contact;

      // タイトル
      document.title = contact.title;

      // ヘッダー名
      if (data.rinen && data.rinen.name) {
        document.getElementById('header-name').textContent = data.rinen.name;
      }

      // ページヘッダー
      document.getElementById('contact-title').textContent = contact.title;
      document.getElementById('contact-text').textContent = contact.text;

      // プライバシーポリシー
      if (contact.privacy) {
        const bodyWrapper = document.getElementById('privacy-body');
        bodyWrapper.innerHTML = '';

        contact.privacy.body.forEach(text => {
          const p = document.createElement('p');
          p.textContent = text;
          bodyWrapper.appendChild(p);
        });
      }

      this.initializeForm();
    } catch (error) {
      console.error('Failed to initialize contact page:', error);
    }
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  const manager = new ContactManager();
  manager.initializePage();
});
