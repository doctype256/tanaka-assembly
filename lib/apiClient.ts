export default class APIClient {
  /**
   * コメント一覧を取得
   */
  async getAllComments(password: string) {
    const res = await fetch(`/api/comments?password=${encodeURIComponent(password)}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  }

  /**
   * コメント承認/非承認
   */
  async updateCommentApproval(id: number, approved: boolean, password: string) {
    const res = await fetch('/api/comments/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved, password }),
    });
    if (!res.ok) throw new Error('Failed to update approval');
    return res.json();
  }

  /**
   * コメント削除
   */
  async deleteComment(id: number, password: string) {
    const res = await fetch('/api/comments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    if (!res.ok) throw new Error('Failed to delete comment');
    return res.json();
  }

  /**
   * お問い合わせ一覧を取得
   */
  async getAllContacts(password: string) {
    const res = await fetch(`/api/contacts?password=${encodeURIComponent(password)}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return res.json();
  }

  /**
   * お問い合わせ削除
   */
  async deleteContact(id: number, password: string) {
    const res = await fetch('/api/contacts/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    if (!res.ok) throw new Error('Failed to delete contact');
    return res.json();
  }
  
}
