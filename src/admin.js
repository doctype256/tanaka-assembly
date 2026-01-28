/**
 * AdminManager クラス
 * 管理画面全体を管理するクラス
 */

import APIClient from './api.js';
import Utils from './utils.js';

/**
 * コメント管理クラス
 */
class CommentManager {
  constructor(api) {
    this.api = api;
    this.allComments = [];
    this.filteredComments = [];
  }

  /**
   * コメント一覧を取得
   */
  async fetchAll(password) {
    this.allComments = await this.api.getAllComments(password);
    this.filteredComments = this.allComments;
    return this.allComments;
  }

  /**
   * コメントを描画
   */
  renderComments(container) {
    if (this.filteredComments.length === 0) {
      container.innerHTML = Utils.getEmptyStateHtml('💬', 'コメントはありません');
      return;
    }

    const html = `
      <table class="comments-table">
        <thead>
          <tr>
            <th>記事タイトル</th>
            <th>投稿者</th>
            <th>コメント</th>
            <th>日時</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredComments.map(comment => `
            <tr>
              <td>${Utils.escapeHtml(comment.article_title)}</td>
              <td>${Utils.escapeHtml(comment.name)}</td>
              <td class="comment-message">${Utils.escapeHtml(comment.message)}</td>
              <td>${Utils.formatDateJP(comment.created_at)}</td>
              <td>
                <span class="approval-status ${comment.approved ? 'approved' : 'pending'}">
                  ${comment.approved ? '承認済み' : '保留中'}
                </span>
              </td>
              <td>
                <button 
                  class="${comment.approved ? 'unapprove-button' : 'approve-button'}" 
                  onclick="window.adminManager.toggleCommentApproval(${comment.id}, ${!comment.approved})">
                  ${comment.approved ? '不承認にする' : '承認する'}
                </button>
                <button class="delete-button" onclick="window.adminManager.deleteCommentHandler(${comment.id})">
                  削除
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;
  }

  /**
   * コメント承認ステータスを切り替え
   */
  async toggleApproval(id, approved, password) {
    await this.api.updateCommentApproval(id, approved, password);
    const comment = this.allComments.find(c => c.id === id);
    if (comment) comment.approved = approved;
    this.filteredComments = this.allComments.filter(c => c.id !== id || c);
  }

  /**
   * コメントを削除
   */
  async delete(id, password) {
    await this.api.deleteComment(id, password);
    this.allComments = this.allComments.filter(c => c.id !== id);
    this.filteredComments = this.allComments;
  }

  /**
   * コメントをフィルタリング
   */
  filter(articleTitle) {
    if (!articleTitle) {
      this.filteredComments = this.allComments;
    } else {
      this.filteredComments = this.allComments.filter(c =>
        c.article_title.toLowerCase().includes(articleTitle.toLowerCase())
      );
    }
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    const uniqueArticles = new Set(this.allComments.map(c => c.article_title));
    return {
      total: this.allComments.length,
      articles: uniqueArticles.size,
    };
  }
}

/**
 * お問い合わせ管理クラス
 */
class ContactListManager {
  constructor(api) {
    this.api = api;
    this.allContacts = [];
    this.filteredContacts = [];
  }

  /**
   * お問い合わせ一覧を取得
   */
  async fetchAll(password) {
    this.allContacts = await this.api.getAllContacts(password);
    this.filteredContacts = this.allContacts;
    return this.allContacts;
  }

  /**
   * お問い合わせを描画
   */
  renderContacts(container) {
    if (this.filteredContacts.length === 0) {
      container.innerHTML = Utils.getEmptyStateHtml('📧', 'お問い合わせはありません');
      return;
    }

    const html = `
      <table class="comments-table">
        <thead>
          <tr>
            <th>お名前</th>
            <th>フリガナ</th>
            <th>メールアドレス</th>
            <th>お問い合わせ内容</th>
            <th>日時</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredContacts.map(contact => `
            <tr>
              <td>${Utils.escapeHtml(contact.name)}</td>
              <td>${Utils.escapeHtml(contact.furigana)}</td>
              <td>${Utils.escapeHtml(contact.email)}</td>
              <td class="comment-message">${Utils.escapeHtml(contact.message)}</td>
              <td>${Utils.formatDateJP(contact.created_at)}</td>
              <td>
                <button class="delete-button" onclick="window.adminManager.deleteContactHandler(${contact.id})">
                  削除
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;
  }

  /**
   * お問い合わせを削除
   */
  async delete(id, password) {
    await this.api.deleteContact(id, password);
    this.allContacts = this.allContacts.filter(c => c.id !== id);
    this.filteredContacts = this.allContacts;
  }

  /**
   * お問い合わせをフィルタリング
   */
  filter(email) {
    if (!email) {
      this.filteredContacts = this.allContacts;
    } else {
      this.filteredContacts = this.allContacts.filter(c =>
        c.email.toLowerCase().includes(email.toLowerCase())
      );
    }
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    return {
      total: this.allContacts.length,
    };
  }
}

/**
 * ご相談ポスト管理クラス
 */
class PostManager {
  constructor(api) {
    this.api = api;
    this.allPosts = [];
  }

  /**
   * ポスト一覧を取得
   */
  async fetchAll(password) {
    const response = await fetch('/api/posts?all=true&password=' + encodeURIComponent(password));
    if (!response.ok) throw new Error('Failed to fetch posts');
    this.allPosts = await response.json();
    return this.allPosts;
  }

  /**
   * ポストを描画
   */
  renderPosts(container) {
    if (this.allPosts.length === 0) {
      container.innerHTML = Utils.getEmptyStateHtml('📝', 'ポストはありません');
      return;
    }

    const html = `
      <table class="comments-table">
        <thead>
          <tr>
            <th>相談者名</th>
            <th>件名</th>
            <th>相談内容</th>
            <th>投稿日時</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${this.allPosts.map(post => `
            <tr>
              <td>${post.name || '（未入力）'}</td>
              <td>${post.subject || '（未入力）'}</td>
              <td class="comment-message">${post.content}</td>
              <td>${new Date(post.created_at).toLocaleString('ja-JP')}</td>
              <td>${post.approved ? '<span style="color: green;">✓ 承認</span>' : '<span style="color: red;">✗ 未承認</span>'}</td>
              <td>
                <button class="approve-button" onclick="window.adminManager.togglePostApproval(${post.id}, ${post.approved ? 0 : 1})">
                  ${post.approved ? '不承認' : '承認'}
                </button>
                <button class="delete-button" onclick="window.adminManager.deletePostHandler(${post.id})">削除</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;
  }

  /**
   * 承認ステータスを切り替え
   */
  async toggleApproval(id, approved, password) {
    const response = await fetch('/api/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved, password })
    });
    if (!response.ok) throw new Error('Failed to update post');
  }

  /**
   * ポストを削除
   */
  async delete(id, password) {
    const response = await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    if (!response.ok) throw new Error('Failed to delete post');
  }

  /**
   * 統計情報を取得
   */
  getStats() {
    const unapproved = this.allPosts.filter(p => !p.approved).length;
    return {
      total: this.allPosts.length,
      unapproved: unapproved,
    };
  }
}

/**
 * プロフィール管理クラス
 */
class ProfileManager {
  constructor(api) {
    this.api = api;
    this.profile = null;
  }

  /**
   * プロフィール情報を取得
   */
  async fetch(password) {
    const response = await fetch(`/api/profile?password=${encodeURIComponent(password)}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    this.profile = await response.json();
    return this.profile;
  }

  /**
   * プロフィール情報を保存
   */
  async save(profileData, password) {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profileData, password })
    });
    if (!response.ok) throw new Error('Failed to save profile');
  }

  /**
   * フォームにデータを読み込む
   */
  loadForm() {
    if (!this.profile) return;
    
    document.getElementById('profile-name').value = this.profile.Name || '';
    document.getElementById('profile-img-url').value = this.profile.IMG_URL || '';
    document.getElementById('profile-birthday').value = this.profile.birthday || '';
    document.getElementById('profile-from').value = this.profile.From || '';
    document.getElementById('profile-family').value = this.profile.Family || '';
    document.getElementById('profile-job').value = this.profile.Job || '';
    document.getElementById('profile-hobby').value = this.profile.hobby || '';
  }

  /**
   * フォームからデータを取得
   */
  getFormData() {
    return {
      Name: document.getElementById('profile-name').value,
      IMG_URL: document.getElementById('profile-img-url').value,
      birthday: document.getElementById('profile-birthday').value,
      From: document.getElementById('profile-from').value,
      Family: document.getElementById('profile-family').value,
      Job: document.getElementById('profile-job').value,
      hobby: document.getElementById('profile-hobby').value,
    };
  }
}

/**
 * 経歴管理クラス
 */
class CareerManager {
  constructor(api) {
    this.api = api;
    this.careers = [];
  }

  /**
   * 経歴一覧を取得
   */
  async fetch(password) {
    const response = await fetch(`/api/career?password=${encodeURIComponent(password)}`);
    if (!response.ok) throw new Error('Failed to fetch careers');
    this.careers = await response.json();
    return this.careers;
  }

  /**
   * 経歴を追加
   */
  async add(year, month, content, password) {
    const response = await fetch('/api/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month, Content: content, password })
    });
    if (!response.ok) throw new Error('Failed to add career');
  }

  /**
   * 経歴を削除
   */
  async delete(id, password) {
    const response = await fetch('/api/career', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    if (!response.ok) throw new Error('Failed to delete career');
  }

  /**
   * 経歴一覧を表示
   */
  render(container) {
    if (this.careers.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999;">経歴が登録されていません</p>';
      return;
    }

    const html = `
      <table class="comments-table">
        <thead>
          <tr>
            <th>年</th>
            <th>月</th>
            <th>内容</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${this.careers.map(career => `
            <tr>
              <td>${career.year}</td>
              <td>${career.month}</td>
              <td>${career.Content}</td>
              <td>
                <button class="delete-button" onclick="window.adminManager.deleteCareerHandler(${career.id})">削除</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;
  }
}

/**
 * 管理者ページメインクラス
 */
class AdminManager {
  constructor() {
    this.api = new APIClient();
    this.comments = new CommentManager(this.api);
    this.contacts = new ContactListManager(this.api);
    this.posts = new PostManager(this.api);
    this.profile = new ProfileManager(this.api);
    this.career = new CareerManager(this.api);
    this.pdf = new PDFManager(this.api);
    this.adminPassword = null;
  }

  /**
   * 初期化
   */
  initialize() {
    this.setupEventListeners();
    this.initializeTabs();
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // ログインフォーム
    document.getElementById('login-input').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('logout-button').addEventListener('click', () => this.handleLogout());

    // コメントフィルター
    document.getElementById('filter-button').addEventListener('click', () => this.filterComments());
    document.getElementById('clear-filter').addEventListener('click', () => this.clearCommentFilter());
    document.getElementById('filter-article').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.filterComments();
    });

    // お問い合わせフィルター
    document.getElementById('filter-contact-button').addEventListener('click', () => this.filterContacts());
    document.getElementById('clear-contact-filter').addEventListener('click', () => this.clearContactFilter());
    document.getElementById('filter-contact-email').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.filterContacts();
    });

    // プロフィール編集フォーム
    document.getElementById('profile-form').addEventListener('submit', (e) => this.handleProfileSave(e));

    // 経歴追加フォーム
    document.getElementById('career-form').addEventListener('submit', (e) => this.handleCareerAdd(e));

    // PDF追加フォーム
    document.getElementById('pdf-form').addEventListener('submit', (e) => this.handlePDFAdd(e));
  }

  /**
   * タブ切り替え処理
   */
  initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
      });
    });

    // 最初のタブをアクティブに
    document.querySelector('.tab-button').classList.add('active');
    document.getElementById('comments-tab').classList.add('active');
  }

  /**
   * ログイン処理
   */
  async handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;

    try {
      console.log('[Admin] Starting login with password...');
      await Promise.all([
        this.comments.fetchAll(password),
        this.contacts.fetchAll(password),
        this.posts.fetchAll(password),
        this.profile.fetch(password),
        this.career.fetch(password),
        this.pdf.fetch(password),
      ]);

      this.adminPassword = password;

      console.log('[Admin] Login successful!');
      Utils.showElement('login-form', false);
      Utils.showElement('admin-content', true);

      this.renderAllData();
      this.profile.loadForm();
      this.career.render(document.getElementById('career-list-container'));
      this.pdf.render(document.getElementById('pdf-list-container'));
    } catch (err) {
      console.error('[Admin] Login error:', err);
      Utils.showMessage('login-error', 'パスワードが間違っています', 0);
    }
  }

  /**
   * ログアウト処理
   */
  handleLogout() {
    this.adminPassword = null;
    this.comments = new CommentManager(this.api);
    this.contacts = new ContactListManager(this.api);
    this.posts = new PostManager(this.api);
    this.profile = new ProfileManager(this.api);
    this.career = new CareerManager(this.api);

    document.getElementById('password').value = '';
    Utils.showElement('login-form', true);
    Utils.showElement('admin-content', false);
  }

  /**
   * すべてのデータを描画
   */
  renderAllData() {
    const commentsContainer = document.getElementById('comments-container');
    const contactsContainer = document.getElementById('contacts-container');
    const postsContainer = document.getElementById('posts-container');

    this.comments.renderComments(commentsContainer);
    this.contacts.renderContacts(contactsContainer);
    this.posts.renderPosts(postsContainer);
    this.updateStats();
  }

  /**
   * 統計情報を更新
   */
  updateStats() {
    const commentStats = this.comments.getStats();
    const contactStats = this.contacts.getStats();
    const postStats = this.posts.getStats();

    document.getElementById('total-comments').textContent = commentStats.total;
    document.getElementById('article-count').textContent = commentStats.articles;
    document.getElementById('total-contacts').textContent = contactStats.total;
    document.getElementById('total-posts').textContent = postStats.total;
    document.getElementById('unapproved-posts').textContent = postStats.unapproved;
  }

  /**
   * コメントをフィルタリング
   */
  filterComments() {
    const articleTitle = document.getElementById('filter-article').value;
    this.comments.filter(articleTitle);
    this.comments.renderComments(document.getElementById('comments-container'));
  }

  /**
   * コメントフィルターをクリア
   */
  clearCommentFilter() {
    document.getElementById('filter-article').value = '';
    this.comments.filter('');
    this.comments.renderComments(document.getElementById('comments-container'));
  }

  /**
   * お問い合わせをフィルタリング
   */
  filterContacts() {
    const email = document.getElementById('filter-contact-email').value;
    this.contacts.filter(email);
    this.contacts.renderContacts(document.getElementById('contacts-container'));
  }

  /**
   * お問い合わせフィルターをクリア
   */
  clearContactFilter() {
    document.getElementById('filter-contact-email').value = '';
    this.contacts.filter('');
    this.contacts.renderContacts(document.getElementById('contacts-container'));
  }

  /**
   * コメント承認ステータスを切り替え（公開メソッド）
   */
  async toggleCommentApproval(id, approved) {
    if (!this.adminPassword) return;

    try {
      await this.comments.toggleApproval(id, approved, this.adminPassword);
      this.comments.renderComments(document.getElementById('comments-container'));
      Utils.showMessage('success-message', approved ? '承認しました' : '不承認にしました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message', 'ステータス更新に失敗しました', 3000);
    }
  }

  /**
   * コメント削除ハンドラー（公開メソッド）
   */
  async deleteCommentHandler(id) {
    if (!confirm('このコメントを削除しますか？')) return;
    if (!this.adminPassword) return;

    try {
      await this.comments.delete(id, this.adminPassword);
      this.comments.renderComments(document.getElementById('comments-container'));
      this.updateStats();
      Utils.showMessage('success-message', '削除しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message', '削除に失敗しました', 3000);
    }
  }

  /**
   * お問い合わせ削除ハンドラー（公開メソッド）
   */
  async deleteContactHandler(id) {
    if (!confirm('このお問い合わせを削除しますか？')) return;
    if (!this.adminPassword) return;

    try {
      await this.contacts.delete(id, this.adminPassword);
      this.contacts.renderContacts(document.getElementById('contacts-container'));
      this.updateStats();
      Utils.showMessage('success-message-contact', '削除しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-contact', '削除に失敗しました', 3000);
    }
  }

  /**
   * ポスト承認ステータスを切り替え（公開メソッド）
   */
  async togglePostApproval(id, approved) {
    if (!this.adminPassword) return;

    try {
      await this.posts.toggleApproval(id, approved, this.adminPassword);
      await this.posts.fetchAll(this.adminPassword);
      this.posts.renderPosts(document.getElementById('posts-container'));
      this.updateStats();
      Utils.showMessage('success-message-posts', approved ? '承認しました' : '不承認にしました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-posts', 'ステータス更新に失敗しました', 3000);
    }
  }

  /**
   * ポスト削除ハンドラー（公開メソッド）
   */
  async deletePostHandler(id) {
    if (!confirm('このポストを削除しますか？')) return;
    if (!this.adminPassword) return;

    try {
      await this.posts.delete(id, this.adminPassword);
      await this.posts.fetchAll(this.adminPassword);
      this.posts.renderPosts(document.getElementById('posts-container'));
      this.updateStats();
      Utils.showMessage('success-message-posts', '削除しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-posts', '削除に失敗しました', 3000);
    }
  }

  /**
   * プロフィール保存ハンドラー
   */
  async handleProfileSave(e) {
    e.preventDefault();
    if (!this.adminPassword) return;

    try {
      const profileData = this.profile.getFormData();
      
      // 必須フィールドの確認
      if (!profileData.Name || !profileData.IMG_URL || !profileData.birthday || 
          !profileData.From || !profileData.Family || !profileData.Job || !profileData.hobby) {
        Utils.showMessage('error-message-profile', '全ての項目を入力してください', 3000);
        return;
      }

      await this.profile.save(profileData, this.adminPassword);
      Utils.showMessage('success-message-profile', 'プロフィール情報を保存しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-profile', '保存に失敗しました: ' + err.message, 3000);
    }
  }

  /**
   * 経歴追加ハンドラー
   */
  async handleCareerAdd(e) {
    e.preventDefault();
    if (!this.adminPassword) return;

    try {
      const year = document.getElementById('career-year').value;
      const month = document.getElementById('career-month').value;
      const content = document.getElementById('career-content').value;

      await this.career.add(year, month, content, this.adminPassword);
      
      // フォームをクリア
      document.getElementById('career-form').reset();

      // 経歴リストを更新
      await this.career.fetch(this.adminPassword);
      this.career.render(document.getElementById('career-list-container'));

      Utils.showMessage('success-message-career', '経歴を追加しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-career', '追加に失敗しました', 3000);
    }
  }

  /**
   * 経歴削除ハンドラー
   */
  async deleteCareerHandler(id) {
    if (!confirm('この経歴を削除しますか？')) return;
    if (!this.adminPassword) return;

    try {
      await this.career.delete(id, this.adminPassword);
      
      // 経歴リストを更新
      await this.career.fetch(this.adminPassword);
      this.career.render(document.getElementById('career-list-container'));

      Utils.showMessage('success-message-career', '削除しました', 3000);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-career', '削除に失敗しました', 3000);
    }
  }

  /**
   * PDF追加ハンドラー
   */
  async handlePDFAdd(e) {
    e.preventDefault();
    if (!this.adminPassword) return;

    try {
      const title = document.getElementById('pdf-title').value;
      const description = document.getElementById('pdf-description').value;
      const createdAt = document.getElementById('pdf-created-at').value;
      const fileInput = document.getElementById('pdf-file');
      
      if (!title || !fileInput.files[0] || !createdAt) {
        Utils.showMessage('error-message-pdf', '必須項目を入力してください', 3000);
        return;
      }

      const file = fileInput.files[0];
      console.log('[PDF Upload] File selected:', { name: file.name, size: file.size, type: file.type });
      
      // ファイルを Base64 にエンコード
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result;
          console.log('[PDF Upload] Base64 encoded, size:', base64Data.length);
          
          // ファイルを保存するパスを生成
          const timestamp = Date.now();
          const filePath = `uploads/pdf_${timestamp}_${file.name}`;

          // datetime-localの値をISOString形式に変換
          const createdAtISO = new Date(createdAt).toISOString();

          console.log('[PDF Upload] Sending request:', { title, filePath, fileName: file.name, createdAt: createdAtISO });

          // API にデータを送信
          const response = await fetch('/api/pdfs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              description,
              file_path: filePath,
              file_name: file.name,
              file_data: base64Data,
              created_at: createdAtISO,
              password: this.adminPassword
            })
          });

          console.log('[PDF Upload] Response status:', response.status);

          if (!response.ok) {
            const error = await response.json();
            console.error('[PDF Upload] Error response:', error);
            throw new Error(error.error || 'Upload failed');
          }

          const result = await response.json();
          console.log('[PDF Upload] Success:', result);

          // フォームをクリア
          document.getElementById('pdf-form').reset();
          
          Utils.showMessage('success-message-pdf', 'PDFファイルをアップロードしました', 3000);
        } catch (err) {
          console.error('Upload error:', err);
          Utils.showMessage('error-message-pdf', 'アップロードに失敗しました: ' + err.message, 3000);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error:', err);
      Utils.showMessage('error-message-pdf', 'エラーが発生しました', 3000);
    }
  }

  /**
   * PDF削除ハンドラー
   */
  async deletePDFHandler(id) {
    if (!confirm('このPDFを削除してもよろしいですか？')) {
      return;
    }

    try {
      await this.pdf.delete(id, this.adminPassword);
      Utils.showMessage('success-message-pdf', 'PDFファイルを削除しました', 3000);
      this.pdf.render(document.getElementById('pdf-list-container'));
    } catch (err) {
      console.error('Delete error:', err);
      Utils.showMessage('error-message-pdf', 'PDFの削除に失敗しました: ' + err.message, 3000);
    }
  }
}

/**
 * PDF管理クラス
 */
class PDFManager {
  constructor(api) {
    this.api = api;
    this.pdfs = [];
  }

  /**
   * PDF一覧を取得
   */
  async fetch(password) {
    try {
      const response = await fetch('/api/pdfs');
      this.pdfs = await response.json();
      return this.pdfs;
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
      return [];
    }
  }

  /**
   * PDFを削除
   */
  async delete(id, password) {
    const response = await fetch('/api/pdfs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    if (!response.ok) throw new Error('Failed to delete PDF');
  }

  /**
   * PDFリストを描画
   */
  render(container) {
    if (this.pdfs.length === 0) {
      container.innerHTML = '<p>登録されたPDFファイルはありません</p>';
      return;
    }

    const html = `
      <table class="comments-table" style="margin-top: 20px;">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>ファイル名</th>
            <th>アップロード日時</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${this.pdfs.map(pdf => `
            <tr>
              <td>${pdf.title}</td>
              <td>${pdf.file_name}</td>
              <td>${new Date(pdf.created_at).toLocaleDateString('ja-JP')}</td>
              <td>
                <button class="delete-button" onclick="window.adminManager.deletePDFHandler(${pdf.id})">削除</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = html;
  }
}

/**
 * AdminManager クラス拡張
 */
// AdminManager コンストラクタに PDF 初期化を追加
const originalConstructor = AdminManager.prototype.constructor;

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  const manager = new AdminManager();
  manager.initialize();
  window.adminManager = manager; // グローバルにアクセス可能にする
});
