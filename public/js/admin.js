/**
 * AdminManager クラス
 * 管理画面全体を管理するクラス
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import APIClient from './api.js';
import Utils from './utils.js';
/**
 * コメント管理クラス
 */
var CommentManager = /** @class */ (function () {
    function CommentManager(api) {
        this.api = api;
        this.allComments = [];
        this.filteredComments = [];
    }
    /**
     * コメント一覧を取得
     */
    CommentManager.prototype.fetchAll = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.api.getAllComments(password)];
                    case 1:
                        _a.allComments = _b.sent();
                        this.filteredComments = this.allComments;
                        return [2 /*return*/, this.allComments];
                }
            });
        });
    };
    /**
     * コメントを描画
     */
    CommentManager.prototype.renderComments = function (container) {
        if (this.filteredComments.length === 0) {
            container.innerHTML = Utils.getEmptyStateHtml('💬', 'コメントはありません');
            return;
        }
        var html = "\n      <table class=\"comments-table\">\n        <thead>\n          <tr>\n            <th>\u8A18\u4E8B\u30BF\u30A4\u30C8\u30EB</th>\n            <th>\u6295\u7A3F\u8005</th>\n            <th>\u30B3\u30E1\u30F3\u30C8</th>\n            <th>\u65E5\u6642</th>\n            <th>\u30B9\u30C6\u30FC\u30BF\u30B9</th>\n            <th>\u64CD\u4F5C</th>\n          </tr>\n        </thead>\n        <tbody>\n          ".concat(this.filteredComments.map(function (comment) { return "\n            <tr>\n              <td>".concat(Utils.escapeHtml(comment.article_title), "</td>\n              <td>").concat(Utils.escapeHtml(comment.name), "</td>\n              <td class=\"comment-message\">").concat(Utils.escapeHtml(comment.message), "</td>\n              <td>").concat(Utils.formatDateJP(comment.created_at), "</td>\n              <td>\n                <span class=\"approval-status ").concat(comment.approved ? 'approved' : 'pending', "\">\n                  ").concat(comment.approved ? '承認済み' : '保留中', "\n                </span>\n              </td>\n              <td>\n                <button \n                  class=\"").concat(comment.approved ? 'unapprove-button' : 'approve-button', "\" \n                  onclick=\"window.adminManager.toggleCommentApproval(").concat(comment.id, ", ").concat(!comment.approved, ")\">\n                  ").concat(comment.approved ? '不承認にする' : '承認する', "\n                </button>\n                <button class=\"delete-button\" onclick=\"window.adminManager.deleteCommentHandler(").concat(comment.id, ")\">\n                  \u524A\u9664\n                </button>\n              </td>\n            </tr>\n          "); }).join(''), "\n        </tbody>\n      </table>\n    ");
        container.innerHTML = html;
    };
    /**
     * コメント承認ステータスを切り替え
     */
    CommentManager.prototype.toggleApproval = function (id, approved, password) {
        return __awaiter(this, void 0, void 0, function () {
            var comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.updateCommentApproval(id, approved, password)];
                    case 1:
                        _a.sent();
                        comment = this.allComments.find(function (c) { return c.id === id; });
                        if (comment)
                            comment.approved = approved;
                        this.filteredComments = this.allComments.filter(function (c) { return c.id !== id || c; });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * コメントを削除
     */
    CommentManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.deleteComment(id, password)];
                    case 1:
                        _a.sent();
                        this.allComments = this.allComments.filter(function (c) { return c.id !== id; });
                        this.filteredComments = this.allComments;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * コメントをフィルタリング
     */
    CommentManager.prototype.filter = function (articleTitle) {
        if (!articleTitle) {
            this.filteredComments = this.allComments;
        }
        else {
            this.filteredComments = this.allComments.filter(function (c) {
                return c.article_title.toLowerCase().includes(articleTitle.toLowerCase());
            });
        }
    };
    /**
     * 統計情報を取得
     */
    CommentManager.prototype.getStats = function () {
        var uniqueArticles = new Set(this.allComments.map(function (c) { return c.article_title; }));
        return {
            total: this.allComments.length,
            articles: uniqueArticles.size,
        };
    };
    return CommentManager;
}());
/**
 * お問い合わせ管理クラス
 */
var ContactListManager = /** @class */ (function () {
    function ContactListManager(api) {
        this.api = api;
        this.allContacts = [];
        this.filteredContacts = [];
    }
    /**
     * お問い合わせ一覧を取得
     */
    ContactListManager.prototype.fetchAll = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.api.getAllContacts(password)];
                    case 1:
                        _a.allContacts = _b.sent();
                        this.filteredContacts = this.allContacts;
                        return [2 /*return*/, this.allContacts];
                }
            });
        });
    };
    /**
     * お問い合わせを描画
     */
    ContactListManager.prototype.renderContacts = function (container) {
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
    };
    /**
     * お問い合わせを削除
     */
    ContactListManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.deleteContact(id, password)];
                    case 1:
                        _a.sent();
                        this.allContacts = this.allContacts.filter(function (c) { return c.id !== id; });
                        this.filteredContacts = this.allContacts;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * お問い合わせをフィルタリング
     */
    ContactListManager.prototype.filter = function (email) {
        if (!email) {
            this.filteredContacts = this.allContacts;
        }
        else {
            this.filteredContacts = this.allContacts.filter(function (c) {
                return c.email.toLowerCase().includes(email.toLowerCase());
            });
        }
    };
    /**
     * 統計情報を取得
     */
    ContactListManager.prototype.getStats = function () {
        return {
            total: this.allContacts.length,
        };
    };
    return ContactListManager;
}());
/**
 * ご相談ポスト管理クラス
 */
var PostManager = /** @class */ (function () {
    function PostManager(api) {
        this.api = api;
        this.allPosts = [];
    }
    /**
     * ポスト一覧を取得
     */
    PostManager.prototype.fetchAll = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch('/api/posts?all=true&password=' + encodeURIComponent(password))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch posts');
                        _a = this;
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a.allPosts = _b.sent();
                        return [2 /*return*/, this.allPosts];
                }
            });
        });
    };
    /**
     * ポストを描画
     */
    PostManager.prototype.renderPosts = function (container) {
        if (this.allPosts.length === 0) {
            container.innerHTML = Utils.getEmptyStateHtml('📝', 'ポストはありません');
            return;
        }
        const html = `
          <div style="display: flex; flex-direction: column; gap: 15px;">
            ${this.allPosts.map(post => `
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9;">
                <div style="margin-bottom: 10px;">
                  <strong>相談者:</strong> ${post.name || '（未入力）'} | <strong>件名:</strong> ${post.subject || '（未入力）'}<br/>
                  <strong>投稿日:</strong> ${new Date(post.created_at).toLocaleString('ja-JP')}<br/>
                  <strong>ステータス:</strong> ${post.approved ? '<span style="color: green;">✓ 承認済み</span>' : '<span style="color: red;">✗ 未承認</span>'}
                </div>
                <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 3px;">
                  <strong>相談内容:</strong><br/>
                  ${post.content}
                </div>
                <div style="margin-bottom: 10px;">
                  <label style="display: block; margin-bottom: 5px;"><strong>返信内容:</strong></label>
                  <textarea 
                    id="reply-${post.id}" 
                    placeholder="返信内容を入力してください"
                    style="width: 100%; min-height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 3px; font-family: inherit;"
                  >${post.reply || ''}</textarea>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button 
                    class="login-button" 
                    style="flex: 1;"
                    onclick="window.adminManager.savePostReplyAndApprove(${post.id})">
                    返信を保存して承認
                  </button>
                  <button 
                    class="login-button" 
                    style="flex: 1; background-color: #666;"
                    onclick="window.adminManager.savePostReply(${post.id})">
                    返信を保存
                  </button>
                  <button class="delete-button" onclick="window.adminManager.deletePostHandler(${post.id})">削除</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        container.innerHTML = html;
    };
    /**
     * 承認ステータスを切り替え
     */
    PostManager.prototype.toggleApproval = function (id, approved, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/posts', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, approved: approved, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to update post');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポストに返信を保存
     */
    PostManager.prototype.saveReply = function (id, reply, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/posts', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, reply: reply, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to save reply');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポストに返信を保存して承認
     */
    PostManager.prototype.saveReplyAndApprove = function (id, reply, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/posts', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, reply: reply, approved: 1, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to save reply and approve post');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポストを削除
     */
    PostManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/posts', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to delete post');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 統計情報を取得
     */
    PostManager.prototype.getStats = function () {
        var unapproved = this.allPosts.filter(function (p) { return !p.approved; }).length;
        return {
            total: this.allPosts.length,
            unapproved: unapproved,
        };
    };
    return PostManager;
}());
/**
 * プロフィール管理クラス
 */
var ProfileManager = /** @class */ (function () {
    function ProfileManager(api) {
        this.api = api;
        this.profile = null;
        this.originalProfile = null;
    }
    /**
     * プロフィール情報を取得
     */
    ProfileManager.prototype.fetch = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/profile?password=' + encodeURIComponent(password))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) throw new Error('プロフィール情報の取得に失敗しました');
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        this.profile = data.profile || data;
                        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
                        return [3 /*break*/, 4];
                    case 3:
                        err = _a.sent();
                        console.error('[ProfileManager.fetch] Error:', err);
                        Utils.showMessage('error-message-profile', 'プロフィール情報の取得に失敗しました', 3000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * プロフィール情報を保存
     */
    ProfileManager.prototype.save = function (profileData, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[ProfileManager] Saving to API:', profileData);
                        return [4 /*yield*/, fetch('/api/profile', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(__assign(__assign({}, profileData), { password: password }))
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to save profile');
                        // 保存成功後、編集前のデータを更新
                        this.profile = JSON.parse(JSON.stringify(profileData));
                        this.originalProfile = JSON.parse(JSON.stringify(profileData));
                        console.log('[ProfileManager] Save response OK');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * フォームにデータを読み込む
     */
    ProfileManager.prototype.loadForm = function () {
        if (!this.profile)
            return;
        document.getElementById('profile-name').value = this.profile.Name || '';
        document.getElementById('profile-birthday').value = this.profile.birthday || '';
        document.getElementById('profile-from').value = this.profile.From || '';
        document.getElementById('profile-family').value = this.profile.Family || '';
        document.getElementById('profile-job').value = this.profile.Job || '';
        document.getElementById('profile-hobby').value = this.profile.hobby || '';
        // 既存画像がある場合、プレビューを表示
        var imgUrl = this.profile.IMG_URL || '';
        console.log('[ProfileManager.loadForm] Current IMG_URL:', imgUrl);
        var previewImg = document.getElementById('profile-preview-img');
        var placeholder = document.getElementById('profile-preview-placeholder');
        if (imgUrl && imgUrl.trim()) {
            if (previewImg) {
                previewImg.src = imgUrl;
                previewImg.style.display = 'block';
            }
            if (placeholder)
                placeholder.style.display = 'none';
        }
        else {
            if (previewImg)
                previewImg.style.display = 'none';
            if (placeholder)
                placeholder.style.display = 'block';
        }
        // 現在の IMG_URL を hidden フィールドに保存
        document.getElementById('profile-img-url').value = imgUrl;
        // 写真ファイル入力は初期値を設定しない（ユーザーが新規選択）
        var fileInput = document.getElementById('profile-img-file');
        if (fileInput) {
            fileInput.value = '';
            console.log('[ProfileManager.loadForm] File input cleared');
        }
    };
    /**
     * フォームからデータを取得
     */
    ProfileManager.prototype.getFormData = function () {
        return {
            Name: document.getElementById('profile-name').value,
            IMG_URL: document.getElementById('profile-img-url').value,
            birthday: document.getElementById('profile-birthday').value,
            From: document.getElementById('profile-from').value,
            Family: document.getElementById('profile-family').value,
            Job: document.getElementById('profile-job').value,
            hobby: document.getElementById('profile-hobby').value,
        };
    };
    return ProfileManager;
}());
/**
 * 経歴管理クラス
 */
var CareerManager = /** @class */ (function () {
    function CareerManager(api) {
        this.api = api;
        this.careers = [];
    }
    /**
     * 経歴一覧を取得
     */
    CareerManager.prototype.fetch = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/career?password=".concat(encodeURIComponent(password)))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok)
                            throw new Error('Failed to fetch careers');
                        _a = this;
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a.careers = _b.sent();
                        return [2 /*return*/, this.careers];
                }
            });
        });
    };
    /**
     * 経歴を追加
     */
    CareerManager.prototype.add = function (year, month, content, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/career', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ year: year, month: month, Content: content, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to add career');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 経歴を削除
     */
    CareerManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/career', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to delete career');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 経歴一覧を表示
     */
    CareerManager.prototype.render = function (container) {
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
    };
    return CareerManager;
}());

function activateTab(tabId) {
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
}
/**
 * 管理者ページメインクラス
 */
var AdminManager = /** @class */ (function () {
    function AdminManager() {
        this.api = new APIClient();
        this.comments = new CommentManager(this.api);
        this.contacts = new ContactListManager(this.api);
        this.posts = new PostManager(this.api);
        this.profile = new ProfileManager(this.api);
        this.career = new CareerManager(this.api);
        this.pdf = new PDFManager(this.api);
        this.activityReports = new ActivityReportManager(this.api);
        this.adminPassword = null;
        this.adminPassword = sessionStorage.getItem('adminPassword') || '';
    }
    /**
    * 初期化
    */
    AdminManager.prototype.initialize = function () {
  const password = sessionStorage.getItem('adminPassword');

  // 🔐 パスワードが存在するかつログインフォームが非表示なら表示
  if (password && !document.getElementById('login-form').offsetParent) {
    const tab = document.getElementById('change-password-tab');
    if (tab) tab.style.display = 'block';
  }

  this.setupEventListeners();
  this.initializeTabs();
};

    /**
 * イベントリスナーを設定
 */
AdminManager.prototype.setupEventListeners = function () {
  // --- タブ切り替え処理 ---
  const tabButtons = document.querySelectorAll('.tab-button');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target'); // 例: "change-password-tab"
      activateTab(targetId);

      // タブボタンの見た目も切り替え
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // --- カテゴリのローカルストレージ管理 ---
  const CATEGORY_KEY = 'activity_custom_categories';
  const select = document.getElementById('activity-category');

  // 初期化時にlocalStorageから復元
  function loadCustomCategories() {
    if (!select) return;
    const saved = localStorage.getItem(CATEGORY_KEY);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        arr.forEach(function (val) {
          if (!Array.from(select.options).some(opt => opt.value === val)) {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
          }
        });
      } catch (e) {
        console.warn('カテゴリの読み込みに失敗しました:', e);
      }
    }
  }

  loadCustomCategories();

  function saveCustomCategories() {
    if (!select) return;
    const defaultVals = ['committee', 'childcare', 'reform', 'topics', ''];
    const arr = Array.from(select.options)
      .map(opt => opt.value)
      .filter(val => val && !defaultVals.includes(val));
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(arr));
  }
                // 活動報告カテゴリ追加ボタン
                var addCategoryBtn = document.getElementById('add-activity-category');
                if (addCategoryBtn) {
                    addCategoryBtn.addEventListener('click', function () {
                        var input = document.getElementById('new-activity-category');
                        var select = document.getElementById('activity-category');
                        if (!input || !select) return;
                        var val = input.value.trim();
                        if (!val) return;
                        // value属性はvalueそのまま、表示もそのまま
                        var exists = Array.from(select.options).some(function(opt){ return opt.value === val; });
                        if (exists) {
                            Utils.showMessage('error-message-activity-report', '同じカテゴリが既に存在します', 2000);
                            return;
                        }
                        var opt = document.createElement('option');
                        opt.value = val;
                        opt.textContent = val;
                        select.appendChild(opt);
                        select.value = val;
                        input.value = '';
                        Utils.showMessage('success-message-activity-report', 'カテゴリを追加しました', 1500);
                        saveCustomCategories();
                    });
                }

                // 活動報告カテゴリ削除ボタン
                var deleteCategoryBtn = document.getElementById('delete-activity-category');
                if (deleteCategoryBtn) {
                    deleteCategoryBtn.addEventListener('click', function () {
                        var select = document.getElementById('activity-category');
                        if (!select) return;
                        var val = select.value;
                        if (!val) {
                            Utils.showMessage('error-message-activity-report', '削除するカテゴリを選択してください', 2000);
                            return;
                        }
                        // デフォルトカテゴリは削除不可
                        var defaultVals = ['committee','childcare','reform','topics',''];
                        if (defaultVals.includes(val)) {
                            var msgElem = document.getElementById('error-message-activity-report');
                            if (msgElem) {
                                msgElem.textContent = 'このカテゴリは削除できません';
                                msgElem.style.color = 'red';
                                msgElem.style.fontWeight = 'bold';
                                msgElem.style.display = 'block';
                                setTimeout(function(){
                                    msgElem.textContent = '';
                                    msgElem.style.display = '';
                                }, 2000);
                            }
                            return;
                        }
                        var idx = select.selectedIndex;
                        if (idx > -1) {
                            select.remove(idx);
                            // 先頭に戻す
                            select.value = '';
                            Utils.showMessage('success-message-activity-report', 'カテゴリを削除しました', 1500);
                            saveCustomCategories();
                        }
                    });
                }
        var _this = this;
        // ログインフォーム
        document.getElementById('login-input').addEventListener('submit', function (e) { return _this.handleLogin(e); });
        document.getElementById('logout-button').addEventListener('click', function () { return _this.handleLogout(); });
        // コメントフィルター
        document.getElementById('filter-button').addEventListener('click', function () { return _this.filterComments(); });
        document.getElementById('clear-filter').addEventListener('click', function () { return _this.clearCommentFilter(); });
        document.getElementById('filter-article').addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                _this.filterComments();
        });
        // ✅ パスワード変更フォーム
        const changePasswordForm = document.getElementById('change-password-form');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', this.handleChangePassword.bind(this));
        }
        // お問い合わせフィルター
        document.getElementById('filter-contact-button').addEventListener('click', function () { return _this.filterContacts(); });
        document.getElementById('clear-contact-filter').addEventListener('click', function () { return _this.clearContactFilter(); });
        document.getElementById('filter-contact-email').addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                _this.filterContacts();
        });
        // プロフィール編集フォーム
        document.getElementById('profile-form').addEventListener('submit', function (e) { return _this.handleProfileSave(e); });
        // プロフィール画像ファイル選択時のイベント
        var fileInput = document.getElementById('profile-img-file');
        console.log('[Setup] fileInput element found:', !!fileInput);
        if (fileInput) {
            console.log('[Setup] Attaching change event listener to profile-img-file');
            fileInput.addEventListener('change', function (e) {
                var _a;
                var input = e.target;
                console.log('[FileInput] Change event fired');
                console.log('[FileInput] files property:', input.files);
                console.log('[FileInput] files length:', (_a = input.files) === null || _a === void 0 ? void 0 : _a.length);
                if (input.files && input.files[0]) {
                    var file = input.files[0];
                    console.log('[FileInput] File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
                    // ファイル選択時にプレビューを表示（ローカルデータURL）
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var dataUrl = event.target.result;
                        console.log('[FileInput] FileReader loaded, dataUrl length:', dataUrl.length);
                        _this.updateImagePreview(dataUrl);
                        console.log('[FileInput] Preview updated with local file');
                    };
                    reader.onerror = function () {
                        console.error('[FileInput] FileReader error');
                    };
                    console.log('[FileInput] Calling readAsDataURL');
                    reader.readAsDataURL(file);
                }
                else {
                    console.log('[FileInput] No file selected - files[0] is undefined');
                }
            });
            console.log('[Setup] Change event listener attached successfully');
        }
        else {
            console.error('[Setup] profile-img-file element NOT FOUND');
        }
        // 経歴追加フォーム
        document.getElementById('career-form').addEventListener('submit', function (e) { return _this.handleCareerAdd(e); });
        // PDF追加フォーム
        document.getElementById('pdf-form').addEventListener('submit', function (e) { return _this.handlePDFAdd(e); });
        // 活動報告フォーム
        var activityReportForm = document.getElementById('activity-report-form');
        if (activityReportForm) {
            // デフォルトは新規作成
            activityReportForm.addEventListener('submit', function (e) {
                if (activityReportForm.dataset.mode === 'edit') {
                    _this.handleActivityReportEditSubmit(e);
                } else {
                    _this.handleActivityReportAdd(e);
                }
            });
        }
        // 活動報告画像ファイル選択時のイベント
        var activityPhotosInput = document.getElementById('activity-photos');
        if (activityPhotosInput) {
            activityPhotosInput.addEventListener('change', function (e) {
                var input = e.target;
                var preview = document.getElementById('activity-photos-preview');
                if (preview) preview.innerHTML = '';
                if (input.files && input.files.length > 0) {
                    Array.from(input.files).forEach(function(file) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            var img = document.createElement('img');
                            img.src = event.target.result;
                            img.style.maxWidth = '120px';
                            img.style.maxHeight = '120px';
                            img.style.margin = '5px';
                            img.alt = 'プレビュー';
                            if (preview) preview.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            });
        }
    };
    /**
     * タブ切り替え処理
     */
    AdminManager.prototype.initializeTabs = function () {
        document.querySelectorAll('.tab-button').forEach(function (button) {
            button.addEventListener('click', function () {
                var tabName = button.dataset.tab;
                document.querySelectorAll('.tab-button').forEach(function (b) { return b.classList.remove('active'); });
                button.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(function (content) { return content.classList.remove('active'); });
                document.getElementById(tabName).classList.add('active');
            });
        });
        // 最初のタブをアクティブに
        document.querySelector('.tab-button').classList.add('active');
        document.getElementById('comments-tab').classList.add('active');
    };
    //ログイン処理
    AdminManager.prototype.handleLogin = async function (e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    console.log('[Admin] ログイン処理が開始されました');
    console.log('[Admin] パスワード入力値:', password ? `あり（${password.length}文字）` : 'なし');

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        const data = await res.json();

        if (!res.ok) {
            Utils.showMessage('login-error', data.message, 0);
            console.warn('[Admin] ログイン失敗:', data.message);
            return;
        }

        console.log('[Admin] サーバー認証成功、データ取得を開始します');

        // 認証成功後にデータ取得
        const [comments, contacts, profile, career, pdf, activityReports] = await Promise.all([
            this.comments.fetchAll(password),
            this.contacts.fetchAll(password),
            this.profile.fetch(password),
            this.career.fetch(password),
            this.pdf.fetchAll(password),
            this.activityReports.fetch(password),
        ]);

        try {
            await this.posts.fetchAll(password);
            console.log('[Admin] posts データ取得成功');
        } catch (postsErr) {
            console.warn('[Admin] posts データ取得失敗（テーブルが存在しない可能性）:', postsErr);
            this.posts.allPosts = [];
        }

        console.log('[Admin] ログイン成功！');
        this.adminPassword = password;
        sessionStorage.setItem('adminPassword', password);

        const tab = document.getElementById('change-password-tab'); 
        if (tab) tab.style.display = 'block';

        Utils.showElement('login-form', false);
        Utils.showElement('admin-content', true);
        this.renderAllData();
        this.profile.loadForm();
        this.career.render(document.getElementById('career-list-container'));
        this.pdf.render(document.getElementById('pdf-list-container'));
        this.activityReports.render(document.getElementById('activity-reports-list'));
    } catch (err) {
        console.error('[Admin] ログイン通信エラー:', err);
        Utils.showMessage('login-error', '通信エラーが発生しました', 0);
    }
};

    /**
     * ログアウト処理
     */
    AdminManager.prototype.handleLogout = function () {
        this.adminPassword = null;
        this.comments = new CommentManager(this.api);
        this.contacts = new ContactListManager(this.api);
        this.posts = new PostManager(this.api);
        this.profile = new ProfileManager(this.api);
        this.career = new CareerManager(this.api);
        this.activityReports = new ActivityReportManager(this.api);
        document.getElementById('password').value = '';
        Utils.showElement('login-form', true);
        Utils.showElement('admin-content', false);
        sessionStorage.removeItem('adminPassword');

        const allTabs = document.querySelectorAll('.tab-content'); 
        allTabs.forEach(tab => tab.classList.remove('active'));  
        const tabButtons = document.querySelectorAll('.tab-button'); 
        tabButtons.forEach(btn => btn.classList.remove('active'));
    };
    //パスワード変更処理
    AdminManager.prototype.handleChangePassword = async function (e) {
    e.preventDefault();

    const currentPassword = this.adminPassword;
    const newPassword = document.getElementById('new-password').value.trim();

    console.log('[Admin] パスワード変更開始');
    console.log('[Admin] 現在のパスワード:', currentPassword);
    console.log('[Admin] 新しいパスワード:', newPassword);
    console.log('[Admin] パスワードの長さ:', newPassword.length);

    if (!newPassword || newPassword.length < 4) {
        Utils.showMessage('password-error', '新しいパスワードは4文字以上にしてください', 0);
        return;
    }

    try {
    　const res = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      Utils.showMessage('password-error', data.message, 0);
      console.warn('[Admin] パスワード変更失敗:', data.message);
      return;
    }

    Utils.showMessage('password-success', 'パスワードを変更しました！', 3000);
    console.log('[Admin] パスワード変更成功');
    document.getElementById('new-password').value = '';
  } catch (err) {
    console.error('[Admin] パスワード変更通信エラー:', err);
    Utils.showMessage('password-error', '通信エラーが発生しました', 0);
  }
};


    /**
     * すべてのデータを描画
     */
    AdminManager.prototype.renderAllData = function () {
        var commentsContainer = document.getElementById('comments-container');
        var contactsContainer = document.getElementById('contacts-container');
        var postsContainer = document.getElementById('posts-container');
        this.comments.renderComments(commentsContainer);
        this.contacts.renderContacts(contactsContainer);
        this.posts.renderPosts(postsContainer);
        this.updateStats();
    };
    /**
     * 統計情報を更新
     */
    AdminManager.prototype.updateStats = function () {
        var commentStats = this.comments.getStats();
        var contactStats = this.contacts.getStats();
        var postStats = this.posts.getStats();
        document.getElementById('total-comments').textContent = commentStats.total.toString();
        document.getElementById('article-count').textContent = commentStats.articles.toString();
        document.getElementById('total-contacts').textContent = contactStats.total.toString();
        document.getElementById('total-posts').textContent = postStats.total.toString();
        document.getElementById('unapproved-posts').textContent = postStats.unapproved.toString();
    };
    /**
     * コメントをフィルタリング
     */
    AdminManager.prototype.filterComments = function () {
        var articleTitle = document.getElementById('filter-article').value;
        this.comments.filter(articleTitle);
        this.comments.renderComments(document.getElementById('comments-container'));
    };
    /**
     * コメントフィルターをクリア
     */
    AdminManager.prototype.clearCommentFilter = function () {
        document.getElementById('filter-article').value = '';
        this.comments.filter('');
        this.comments.renderComments(document.getElementById('comments-container'));
    };
    /**
     * お問い合わせをフィルタリング
     */
    AdminManager.prototype.filterContacts = function () {
        var email = document.getElementById('filter-contact-email').value;
        this.contacts.filter(email);
        this.contacts.renderContacts(document.getElementById('contacts-container'));
    };
    /**
     * お問い合わせフィルターをクリア
     */
    AdminManager.prototype.clearContactFilter = function () {
        document.getElementById('filter-contact-email').value = '';
        this.contacts.filter('');
        this.contacts.renderContacts(document.getElementById('contacts-container'));
    };
    /**
     * コメント承認ステータスを切り替え（公開メソッド）
     */
    AdminManager.prototype.toggleCommentApproval = function (id, approved) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.comments.toggleApproval(id, approved, this.adminPassword)];
                    case 2:
                        _a.sent();
                        this.comments.renderComments(document.getElementById('comments-container'));
                        Utils.showMessage('success-message', approved ? '承認しました' : '不承認にしました', 3000);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.error('Error:', err_3);
                        Utils.showMessage('error-message', 'ステータス更新に失敗しました', 3000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * コメント削除ハンドラー（公開メソッド）
     */
    AdminManager.prototype.deleteCommentHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('このコメントを削除しますか？'))
                            return [2 /*return*/];
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.comments.delete(id, this.adminPassword)];
                    case 2:
                        _a.sent();
                        this.comments.renderComments(document.getElementById('comments-container'));
                        this.updateStats();
                        Utils.showMessage('success-message', '削除しました', 3000);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.error('Error:', err_4);
                        Utils.showMessage('error-message', '削除に失敗しました', 3000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * お問い合わせ削除ハンドラー（公開メソッド）
     */
    AdminManager.prototype.deleteContactHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('このお問い合わせを削除しますか？'))
                            return [2 /*return*/];
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.contacts.delete(id, this.adminPassword)];
                    case 2:
                        _a.sent();
                        this.contacts.renderContacts(document.getElementById('contacts-container'));
                        this.updateStats();
                        Utils.showMessage('success-message-contact', '削除しました', 3000);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        console.error('Error:', err_5);
                        Utils.showMessage('error-message-contact', '削除に失敗しました', 3000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポスト承認ステータスを切り替え（公開メソッド）
     */
    AdminManager.prototype.togglePostApproval = function (id, approved) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.posts.toggleApproval(id, approved, this.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.posts.fetchAll(this.adminPassword)];
                    case 3:
                        _a.sent();
                        this.posts.renderPosts(document.getElementById('posts-container'));
                        this.updateStats();
                        Utils.showMessage('success-message-posts', approved ? '承認しました' : '不承認にしました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        console.error('Error:', err_6);
                        Utils.showMessage('error-message-posts', 'ステータス更新に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポスト返信保存ハンドラー（公開メソッド）
     */
    AdminManager.prototype.savePostReply = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var replyText, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        replyText = document.getElementById('reply-' + id).value;
                        if (!replyText || !replyText.trim()) {
                            Utils.showMessage('error-message-posts', '返信内容を入力してください', 3000);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.posts.saveReply(id, replyText, this.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.posts.fetchAll(this.adminPassword)];
                    case 3:
                        _a.sent();
                        this.posts.renderPosts(document.getElementById('posts-container'));
                        Utils.showMessage('success-message-posts', '返信を保存しました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_7 = _a.sent();
                        console.error('Error:', err_7);
                        Utils.showMessage('error-message-posts', '保存に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポスト返信保存して承認ハンドラー（公開メソッド）
     */
    AdminManager.prototype.savePostReplyAndApprove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var replyText, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        replyText = document.getElementById('reply-' + id).value;
                        if (!replyText || !replyText.trim()) {
                            Utils.showMessage('error-message-posts', '返信内容を入力してください', 3000);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.posts.saveReplyAndApprove(id, replyText, this.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.posts.fetchAll(this.adminPassword)];
                    case 3:
                        _a.sent();
                        this.posts.renderPosts(document.getElementById('posts-container'));
                        this.updateStats();
                        Utils.showMessage('success-message-posts', '返信を保存して承認しました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_8 = _a.sent();
                        console.error('Error:', err_8);
                        Utils.showMessage('error-message-posts', '保存に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ポスト削除ハンドラー（公開メソッド）
     */
    AdminManager.prototype.deletePostHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('このポストを削除しますか？'))
                            return [2 /*return*/];
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.posts.delete(id, this.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.posts.fetchAll(this.adminPassword)];
                    case 3:
                        _a.sent();
                        this.posts.renderPosts(document.getElementById('posts-container'));
                        this.updateStats();
                        Utils.showMessage('success-message-posts', '削除しました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _a.sent();
                        console.error('Error:', err_9);
                        Utils.showMessage('error-message-posts', '削除に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 画像プレビューを更新
     */
    AdminManager.prototype.updateImagePreview = function (imgUrl) {
        var previewImg = document.getElementById('profile-preview-img');
        var placeholder = document.getElementById('profile-preview-placeholder');
        if (imgUrl && imgUrl.trim()) {
            previewImg.src = imgUrl;
            previewImg.style.display = 'block';
            if (placeholder)
                placeholder.style.display = 'none';
        }
        else {
            previewImg.style.display = 'none';
            if (placeholder)
                placeholder.style.display = 'block';
        }
    };
    /**
     * プロフィール保存ハンドラー
     */
    AdminManager.prototype.handleProfileSave = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var fileInput, imgUrl, uploadErr_1, errorMsg, name_1, birthday, from, family, job, hobby, finalData, profileData, err_10;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        console.log('[handleProfileSave] CALLED - Form submission detected');
                        e.preventDefault();
                        if (!this.adminPassword) {
                            console.error('[handleProfileSave] No admin password');
                            return [2 /*return*/];
                        }
                        _p.label = 1;
                    case 1:
                        _p.trys.push([1, 9, , 10]);
                        fileInput = document.getElementById('profile-img-file');
                        console.log('[handleProfileSave] fileInput element:', fileInput);
                        console.log('[handleProfileSave] fileInput.files:', fileInput === null || fileInput === void 0 ? void 0 : fileInput.files);
                        console.log('[handleProfileSave] fileInput.files[0]:', (_a = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _a === void 0 ? void 0 : _a[0]);
                        imgUrl = document.getElementById('profile-img-url').value;
                        console.log('[handleProfileSave] Starting...', {
                            hasFile: !!((_b = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _b === void 0 ? void 0 : _b[0]),
                            fileName: (_d = (_c = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.name,
                            fileSize: (_f = (_e = fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.size,
                            currentUrl: imgUrl,
                            adminPassword: !!this.adminPassword
                        });
                        if (!((fileInput === null || fileInput === void 0 ? void 0 : fileInput.files) && fileInput.files[0])) return [3 /*break*/, 6];
                        console.log('[handleProfileSave] ✓ File IS selected!', fileInput.files[0].name);
                        console.log('[handleProfileSave] File selected:', fileInput.files[0].name, 'size:', fileInput.files[0].size);
                        Utils.showMessage('success-message-profile', '写真をアップロード中...', 0);
                        console.log('[handleProfileSave] Calling uploadImageToCloudinary...');
                        _p.label = 2;
                    case 2:
                        _p.trys.push([2, 4, , 5]);
                        console.log('[handleProfileSave] Calling uploadImageToCloudinary with file:', fileInput.files[0].name, 'folder: profiles');
                        return [4 /*yield*/, this.uploadImageToCloudinary(fileInput.files[0], 'profiles')];
                    case 3:
                        imgUrl = _p.sent();
                        console.log('[handleProfileSave] Upload complete! Result:', imgUrl);
                        document.getElementById('profile-img-url').value = imgUrl;
                        // プレビューを更新
                        this.updateImagePreview(imgUrl);
                        return [3 /*break*/, 5];
                    case 4:
                        uploadErr_1 = _p.sent();
                        console.error('[handleProfileSave] Upload error:', uploadErr_1);
                        errorMsg = uploadErr_1.message;
                        console.error('[handleProfileSave] Error message:', errorMsg);
                        alert("\u2717 \u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u5931\u6557\uFF1A".concat(errorMsg));
                        Utils.showMessage('error-message-profile', 'ファイルのアップロードに失敗しました: ' + errorMsg, 3000);
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        console.log('[handleProfileSave] ✗ NO FILE selected - using existing URL:', imgUrl);
                        _p.label = 7;
                    case 7:
                        name_1 = document.getElementById('profile-name').value;
                        birthday = document.getElementById('profile-birthday').value;
                        from = document.getElementById('profile-from').value;
                        family = document.getElementById('profile-family').value;
                        job = document.getElementById('profile-job').value;
                        hobby = document.getElementById('profile-hobby').value;
                        console.log('[ProfileSave] Form data:', { name: name_1, imgUrl: imgUrl, birthday: birthday, from: from, family: family, job: job, hobby: hobby });
                        finalData = {
                            Name: name_1 || (((_g = this.profile.profile) === null || _g === void 0 ? void 0 : _g.Name) || ''),
                            IMG_URL: imgUrl || (((_h = this.profile.profile) === null || _h === void 0 ? void 0 : _h.IMG_URL) || ''),
                            birthday: birthday || (((_j = this.profile.profile) === null || _j === void 0 ? void 0 : _j.birthday) || ''),
                            From: from || (((_k = this.profile.profile) === null || _k === void 0 ? void 0 : _k.From) || ''),
                            Family: family || (((_l = this.profile.profile) === null || _l === void 0 ? void 0 : _l.Family) || ''),
                            Job: job || (((_m = this.profile.profile) === null || _m === void 0 ? void 0 : _m.Job) || ''),
                            hobby: hobby || (((_o = this.profile.profile) === null || _o === void 0 ? void 0 : _o.hobby) || ''),
                        };
                        console.log('[ProfileSave] Original profile data:', this.profile.profile);
                        console.log('[ProfileSave] Final merged data:', finalData);
                        // 最終的に必須項目がすべて揃っているか確認
                        if (!finalData.Name || !finalData.birthday || !finalData.From || !finalData.Family || !finalData.Job || !finalData.hobby) {
                            Utils.showMessage('error-message-profile', '必須項目（氏名、生年月日、出身地、家族構成、前職、趣味）が不足しています', 3000);
                            console.error('[ProfileSave] Missing required fields after merging with original data');
                            return [2 /*return*/];
                        }
                        // 画像URLがない場合は既存のものを使用するか、デフォルト値を使用
                        if (!finalData.IMG_URL) {
                            finalData.IMG_URL = 'assets/自己紹介.png'; // デフォルト画像
                            console.log('[ProfileSave] No image URL, using default image:', finalData.IMG_URL);
                        }
                        console.log('[ProfileSave] Final data before saving:', finalData);
                        profileData = {
                            Name: finalData.Name,
                            IMG_URL: finalData.IMG_URL,
                            birthday: finalData.birthday,
                            From: finalData.From,
                            Family: finalData.Family,
                            Job: finalData.Job,
                            hobby: finalData.hobby,
                        };
                        console.log('[ProfileSave] Saving to API:', profileData);
                        return [4 /*yield*/, this.profile.save(profileData, this.adminPassword)];
                    case 8:
                        _p.sent();
                        console.log('[ProfileSave] Save successful');
                        Utils.showMessage('success-message-profile', 'プロフィール情報を保存しました', 3000);
                        return [3 /*break*/, 10];
                    case 9:
                        err_10 = _p.sent();
                        console.error('[ProfileSave] Error:', err_10);
                        Utils.showMessage('error-message-profile', '保存に失敗しました: ' + err_10.message, 3000);
                        return [3 /*break*/, 10];
                    case 10:
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 経歴追加ハンドラー
     */
    AdminManager.prototype.handleCareerAdd = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var year, month, content, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        year = document.getElementById('career-year').value;
                        month = document.getElementById('career-month').value;
                        content = document.getElementById('career-content').value;
                        return [4 /*yield*/, this.career.add(year, month, content, this.adminPassword)];
                    case 2:
                        _a.sent();
                        // フォームをクリア
                        document.getElementById('career-form').reset();
                        // 経歴リストを更新
                        return [4 /*yield*/, this.career.fetch(this.adminPassword)];
                    case 3:
                        // 経歴リストを更新
                        _a.sent();
                        this.career.render(document.getElementById('career-list-container'));
                        Utils.showMessage('success-message-career', '経歴を追加しました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_11 = _a.sent();
                        console.error('Error:', err_11);
                        Utils.showMessage('error-message-career', '追加に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 経歴削除ハンドラー
     */
    AdminManager.prototype.deleteCareerHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('この経歴を削除しますか？'))
                            return [2 /*return*/];
                        if (!this.adminPassword)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.career.delete(id, this.adminPassword)];
                    case 2:
                        _a.sent();
                        // 経歴リストを更新
                        return [4 /*yield*/, this.career.fetch(this.adminPassword)];
                    case 3:
                        // 経歴リストを更新
                        _a.sent();
                        this.career.render(document.getElementById('career-list-container'));
                        Utils.showMessage('success-message-career', '削除しました', 3000);
                        return [3 /*break*/, 5];
                    case 4:
                        err_12 = _a.sent();
                        console.error('Error:', err_12);
                        Utils.showMessage('error-message-career', '削除に失敗しました', 3000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PDF追加ハンドラー
     */
    AdminManager.prototype.handlePDFAdd = async function (e) {
    e.preventDefault();

    if (!this.adminPassword) return;

    try {
        const title = document.getElementById('pdf-title').value;
        const description = document.getElementById('pdf-description').value;
        const fileInput = document.getElementById('pdf-file');

        if (!title || !fileInput.files || !fileInput.files[0]) {
            Utils.showMessage('error-message-pdf', '必須項目を入力してください', 3000);
            return;
        }

        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append("file_data", file);
        formData.append("filename", "pdf_" + Date.now() + "_" + file.name);
        formData.append("folder", "pdfs");
        formData.append("password", this.adminPassword);

        const uploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            const error = await uploadResponse.json();
            throw new Error(error.error || 'Upload failed');
        }

        const uploadResult = await uploadResponse.json();

        const saveResponse = await fetch('/api/pdfs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                file_path: uploadResult.url,
                file_name: file.name,
                cloudinary_id: uploadResult.public_id,
                password: this.adminPassword
            })
        });

        if (!saveResponse.ok) {
            const error = await saveResponse.json();
            throw new Error(error.error || 'Save failed');
        }

        document.getElementById('pdf-form').reset();
        Utils.showMessage('success-message-pdf', 'PDFファイルをアップロードしました', 3000);

    } catch (err) {
        console.error(err);
        Utils.showMessage('error-message-pdf', 'アップロードに失敗しました: ' + err.message, 3000);
    }
};


    /**
     * 画像をCloudinaryにアップロード（汎用）
     */
    AdminManager.prototype.uploadImageToCloudinary = function (file_2) {
        return __awaiter(this, arguments, void 0, function (file, folder) {
            if (folder === void 0) { folder = 'uploads'; }
            var formData, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[uploadImageToCloudinary] Starting with file:', file.name, ', folder:', folder);
                        formData = new FormData();
                        formData.append('file', file);
                        formData.append('filename', Date.now() + '_' + file.name);
                        formData.append('folder', folder);
                        formData.append('password', this.adminPassword);
                        return [4 /*yield*/, fetch('/api/upload-image', {
                            method: 'POST',
                            body: formData
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        console.log('[uploadImageToCloudinary] Success! Result:', result);
                        return [2 /*return*/, result.url];
                    case 3: return [4 /*yield*/, response.text()];
                    case 4:
                        throw new Error('Upload failed: ' + (_a.sent()).substring(0, 100));
                }
            });
        });
    };
    /**
     * PDF削除ハンドラー
     */
    AdminManager.prototype.deletePDFHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('このPDFを削除してもよろしいですか？')) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.pdf.delete(id, this.adminPassword)];
                    case 2:
                        _a.sent();
                        Utils.showMessage('success-message-pdf', 'PDFファイルを削除しました', 3000);
                        this.pdf.render(document.getElementById('pdf-list-container'));
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _a.sent();
                        console.error('Delete error:', err_15);
                        Utils.showMessage('error-message-pdf', 'PDFの削除に失敗しました: ' + err_15.message, 3000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 活動報告画像プレビュー更新
     */
    AdminManager.prototype.updateActivityReportImagePreview = function (dataUrl) {
        var imgElement = document.getElementById('activity-report-preview-img');
        var placeholderElement = document.getElementById('activity-report-preview-placeholder');
        var urlInput = document.getElementById('activity-report-img-url');
        if (imgElement && placeholderElement && urlInput) {
            imgElement.src = dataUrl;
            imgElement.style.display = 'block';
            placeholderElement.style.display = 'none';
            urlInput.value = dataUrl; // プレビュー用に一時的に保存
        }
    };

/**
 * 活動報告追加ハンドラー（新規作成用）
 */
AdminManager.prototype.handleActivityReportAdd = function (e) {
    return __awaiter(this, void 0, void 0, function () {
        var category, title, year, items, photosInput, imageFiles, imageUrls, err_16, err_17;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!this.adminPassword)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    category = document.getElementById('activity-category');
                    title = document.getElementById('activity-title');
                    year = document.getElementById('activity-year');
                    items = document.getElementById('activity-items');
                    photosInput = document.getElementById('activity-photos');
                    if (!category || !title || !year || !items) {
                        Utils.showMessage('error-message-activity-report', '必須項目（カテゴリー、タイトル、年、内容）を入力してください', 3000);
                        return [2 /*return*/];
                    }
                    category = category.value;
                    title = title.value;
                    year = parseInt(year.value, 10);
                    items = [items.value];
                    imageFiles = photosInput && photosInput.files ? Array.from(photosInput.files) : [];
                    imageUrls = [];
                    if (imageFiles.length > 0) {
                        _b.label = 2;
                    } else {
                        _b.label = 5;
                    }
                    return [3 /*break*/, 2];
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Promise.all(imageFiles.map(function(file){ return this.uploadImageToCloudinary(file, 'activity-reports'); }.bind(this)) )];
                case 3:
                    imageUrls = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_16 = _b.sent();
                    Utils.showMessage('error-message-activity-report', '画像のアップロードに失敗しました', 3000);
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, this.activityReports.add(category, title, year, items, imageUrls, this.adminPassword)];
                case 6:
                    _b.sent();
                    document.getElementById('activity-report-form').reset();
                    Utils.showMessage('success-message-activity-report', '活動報告を追加しました', 3000);
                    return [4 /*yield*/, this.activityReports.fetch(this.adminPassword)];
                case 7:
                    _b.sent();
                    this.activityReports.render(document.getElementById('activity-reports-list'));
                    return [3 /*break*/, 9];
                case 8:
                    err_17 = _b.sent();
                    console.error('Error:', err_17);
                    Utils.showMessage('error-message-activity-report', '追加に失敗しました: ' + err_17.message, 3000);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
};

/**
 * 活動報告編集の送信ハンドラー（編集用）
 */
AdminManager.prototype.handleActivityReportEditSubmit = function (e) {
    return __awaiter(this, void 0, void 0, function () {
        var form, id, category, title, year, items, photosInput, imageFiles, imageUrls, err, submitBtn;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!this.adminPassword) return [2 /*return*/];
                    form = document.getElementById('activity-report-form');
                    id = form && form.dataset.editId;
                    if (!id) {
                        Utils.showMessage('error-message-activity-report', '編集IDがありません', 3000);
                        return [2 /*return*/];
                    }
                    category = document.getElementById('activity-category');
                    title = document.getElementById('activity-title');
                    year = document.getElementById('activity-year');
                    items = document.getElementById('activity-items');
                    photosInput = document.getElementById('activity-photos');
                    if (!category || !title || !year || !items) {
                        Utils.showMessage('error-message-activity-report', '必須項目（カテゴリー、タイトル、年、内容）を入力してください', 3000);
                        return [2 /*return*/];
                    }
                    category = category.value;
                    title = title.value;
                    year = parseInt(year.value, 10);
                    items = [items.value];
                    imageFiles = photosInput && photosInput.files ? Array.from(photosInput.files) : [];
                    imageUrls = [];
                    if (!(imageFiles.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(imageFiles.map(function(file){ return this.uploadImageToCloudinary(file, 'activity-reports'); }.bind(this)) )];
                case 1:
                    imageUrls = _b.sent();
                    _b.label = 2;
                case 2:
                    return [4 /*yield*/, this.activityReports.update(id, category, title, year, items, imageUrls, this.adminPassword)];
                case 3:
                    _b.sent();
                    form.reset();
                    form.dataset.mode = '';
                    form.dataset.editId = '';
                    submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.textContent = '活動報告を保存';
                    Utils.showMessage('success-message-activity-report', '活動報告を更新しました', 3000);
                    return [4 /*yield*/, this.activityReports.fetch(this.adminPassword)];
                case 4:
                    _b.sent();
                    this.activityReports.render(document.getElementById('activity-reports-list'));
                    return [2 /*return*/];
            }
        });
    });
};


    /**
     * 活動報告編集ハンドラー
     */
    AdminManager.prototype.editActivityReportHandler = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var report, imgElement, placeholderElement, form;
            var _a;
            return __generator(this, function (_b) {
                if (!this.adminPassword)
                    return [2 /*return*/];
                report = this.activityReports.reports.find(function (r) { return r.id === id; });
                if (!report) {
                    Utils.showMessage('error-message-activity-report', 'レポートが見つかりません', 3000);
                    return [2 /*return*/];
                }
                // フォームに値を埋める
                form = document.getElementById('activity-report-form');
                if (form) {
                    form.dataset.mode = 'edit';
                    form.dataset.editId = id;
                }
                document.getElementById('activity-category').value = report.category || '';
                document.getElementById('activity-title').value = report.title || '';
                document.getElementById('activity-year').value = report.year || '';
                document.getElementById('activity-items').value = Array.isArray(report.items) ? report.items.join('\n') : '';
                // 画像プレビュー（複数画像対応）
                var photosPreview = document.getElementById('activity-photos-preview');
                if (photosPreview) {
                    photosPreview.innerHTML = '';
                    if (Array.isArray(report.photos) && report.photos.length > 0) {
                        report.photos.forEach(function(url) {
                            var img = document.createElement('img');
                            img.src = url;
                            img.style.maxWidth = '120px';
                            img.style.maxHeight = '120px';
                            img.style.margin = '5px';
                            img.alt = 'プレビュー';
                            photosPreview.appendChild(img);
                        });
                    }
                }
                // ボタン文言変更
                var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
                if (submitBtn) submitBtn.textContent = '活動報告を更新';
                // スクロール
                (_a = document.getElementById('activity-reports-tab')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                return [2 /*return*/];
            });
        });
    };

    /**
     * 活動報告編集の送信ハンドラー
     */
    AdminManager.prototype.handleActivityReportEditSubmit = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var form, id, category, title, year, items, photosInput, imageFiles, imageUrls, err, submitBtn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        if (!this.adminPassword) return [2 /*return*/];
                        form = document.getElementById('activity-report-form');
                        id = form && form.dataset.editId;
                        if (!id) {
                            Utils.showMessage('error-message-activity-report', '編集IDがありません', 3000);
                            return [2 /*return*/];
                        }
                        category = document.getElementById('activity-category');
                        title = document.getElementById('activity-title');
                        year = document.getElementById('activity-year');
                        items = document.getElementById('activity-items');
                        photosInput = document.getElementById('activity-photos');
                        if (!category || !title || !year || !items) {
                            Utils.showMessage('error-message-activity-report', '必須項目（カテゴリー、タイトル、年、内容）を入力してください', 3000);
                            return [2 /*return*/];
                        }
                        category = category.value;
                        title = title.value;
                        year = parseInt(year.value, 10);
                        items = [items.value];
                        imageFiles = photosInput && photosInput.files ? Array.from(photosInput.files) : [];
                        imageUrls = [];
                        if (!(imageFiles.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(imageFiles.map(function(file){ return this.uploadImageToCloudinary(file, 'activity-reports'); }.bind(this)) )];
                    case 1:
                        imageUrls = _b.sent();
                        _b.label = 2;
                    case 2:
                        return [4 /*yield*/, this.activityReports.update(id, category, title, year, items, imageUrls, this.adminPassword)];
                    case 3:
                        _b.sent();
                        form.reset();
                        form.dataset.mode = '';
                        form.dataset.editId = '';
                        // 画像プレビューもクリア
                        var photosPreview = document.getElementById('activity-photos-preview');
                        if (photosPreview) photosPreview.innerHTML = '';
                        submitBtn = form.querySelector('button[type="submit"]');
                        if (submitBtn) submitBtn.textContent = '活動報告を保存';
                        Utils.showMessage('success-message-activity-report', '活動報告を更新しました', 3000);
                        return [4 /*yield*/, this.activityReports.fetch(this.adminPassword)];
                    case 4:
                        _b.sent();
                        this.activityReports.render(document.getElementById('activity-reports-list'));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 活動報告削除ハンドラー
     */
    AdminManager.prototype.deleteActivityReportHandler = function (id) {
        var _this = this;
        if (!confirm('この活動報告を削除しますか？')) return;
        if (!this.adminPassword) return;
        this.activityReports.delete(id, this.adminPassword)
            .then(function () {
                Utils.showMessage('success-message-activity-reports', '活動報告を削除しました', 3000);
                return _this.activityReports.fetch(_this.adminPassword);
            })
            .then(function () {
                _this.activityReports.render(document.getElementById('activity-reports-list'));
            })
            .catch(function (err) {
                console.error('Error:', err);
                Utils.showMessage('error-message-activity-reports', '削除に失敗しました', 3000);
            });
    };
    return AdminManager;
}());
/**
 * PDF管理クラス
 */
var PDFManager = /** @class */ (function () {
    function PDFManager(api) {
        this.api = api;
        this.pdfs = [];
    }
    /**
     * PDF一覧を取得
     */
    PDFManager.prototype.fetch = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/pdfs')];
                    case 1:
                        response = _b.sent();
                        _a = this;
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a.pdfs = _b.sent();
                        return [2 /*return*/, this.pdfs];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Failed to fetch PDFs:', error_1);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PDF一覧を取得（ログイン用）
     */
    PDFManager.prototype.fetchAll = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch(password)];
            });
        });
    };
    /**
     * PDFを削除
     */
    PDFManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/pdfs', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to delete PDF');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PDFリストを描画
     */
    PDFManager.prototype.render = function (container) {
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
    };
    return PDFManager;
}());
/**
 * 活動報告管理クラス
 */
var ActivityReportManager = /** @class */ (function () {
    function ActivityReportManager(api) {
        this.api = api;
        this.reports = [];
    }

    /**
     * 活動報告一覧を取得
     */
    ActivityReportManager.prototype.fetch = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Fetching activity reports...');
                        return [4 /*yield*/, fetch("/api/activity-reports?password=".concat(encodeURIComponent(password)))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            console.error('Failed to fetch activity reports: ', response.statusText);
                            throw new Error('Failed to fetch activity reports');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        this.reports = Array.isArray(data.reports) ? data.reports : [];
                        console.log('Fetched reports: ', this.reports);
                        return [2 /*return*/, this.reports];
                }
            });
        });
    };

    /**
     * 活動報告を追加
     */
    ActivityReportManager.prototype.add = function (category, title, year, items, photos, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Adding new activity report...');
                        return [4 /*yield*/, fetch('/api/activity-reports', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                category: category,
                                title: title,
                                year: year,
                                items: items,
                                photos: photos,
                                password: password
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            console.error('Failed to add activity report: ', response.statusText);
                            throw new Error('Failed to add activity report');
                        }
                        console.log('Activity report added successfully');
                        this.fetch(password).then(function () {
                            var container = document.getElementById('activity-reports-list');
                            if (container) {
                                this.render(container);
                            }
                        }.bind(this));
                        return [2 /*return*/];
                }
            });
        });
    };

    /**
     * 活動報告を更新
     */
    ActivityReportManager.prototype.update = function (id, category, title, year, items, photos, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Updating activity report with id: ', id);
                        return [4 /*yield*/, fetch('/api/activity-reports', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: id,
                                category: category,
                                title: title,
                                year: year,
                                items: items,
                                photos: photos,
                                password: password
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            console.error('Failed to update activity report: ', response.statusText);
                            throw new Error('Failed to update activity report');
                        }
                        console.log('Activity report updated successfully');
                        return [2 /*return*/];
                }
            });
        });
    };

    /**
     * 活動報告を削除
     */
    ActivityReportManager.prototype.delete = function (id, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                        console.log('Deleting activity report with id: ', id);
                        return [4 /*yield*/, fetch('/api/activity-reports', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: id, password: password })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            console.error('Failed to delete activity report: ', response.statusText);
                            throw new Error('Failed to delete activity report');
                        }
                        console.log('Activity report deleted successfully');
                        return [2 /*return*/];
                }
            });
        });
    };

    /**
 * 活動報告を表示
 */
ActivityReportManager.prototype.render = function (container) {
    // containerがnullまたはundefinedかチェック
    if (!container) {
        console.error("Error: container is null or undefined");
        return;
    }

    console.log(this.reports); // データの中身を確認

    // reportsが配列か、それともreportsプロパティが配列であるかを確認
    const reportsArray = Array.isArray(this.reports) ? this.reports : (this.reports.reports || []);

    if (reportsArray.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">活動報告はまだ登録されていません</p>';
        return;
    }

    let html = `
    <table class="comments-table">
        <thead>
            <tr>
                <th>年</th>
                <th>カテゴリー</th>
                <th>タイトル</th>
                <th>内容</th>
                <th>画像</th>
                <th>最終編集</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            ${reportsArray.map(function (report) {
                // updated_atの表示（YYYY/MM/DD HH:mm形式）
                let updatedAt = report.updated_at ? new Date(report.updated_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
                return `
                <tr>
                    <td>${report.year}</td>
                    <td>${Utils.escapeHtml(report.category)}</td>
                    <td>${Utils.escapeHtml(report.title)}</td>
                    <td class="comment-message">${Array.isArray(report.items) ? Utils.escapeHtml(report.items.join('<br>')).substring(0, 50) : ''}...</td>
                    <td>${Array.isArray(report.photos) && report.photos.length > 0 ? report.photos.map(function(url){return '<a href="'+url+'" target="_blank">表示</a>';}).join('<br>') : 'なし'}</td>
                    <td>${updatedAt}</td>
                    <td>
                        <button class="edit-button" onclick="window.adminManager.editActivityReportHandler(${report.id})">
                            編集
                        </button>
                        <button class="delete-button" onclick="window.adminManager.deleteActivityReportHandler(${report.id})">
                            削除
                        </button>
                    </td>
                </tr>
                `;
            }).join('')}
        </tbody>
    </table>
    `;
    container.innerHTML = html;
};


    return ActivityReportManager;
})();

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function () {
    console.log('[Main] DOMContentLoaded event fired');
    var manager = new AdminManager();
    console.log('[Main] AdminManager instance created');
    manager.initialize();
    console.log('[Main] AdminManager.initialize() called');
    window.adminManager = manager; // グローバルにアクセス可能にする
    console.log('[Main] Initialization complete');
});