import { cookies } from 'next/headers';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private userRepo = new UserRepository();

  async getCurrentDisplayName(): Promise<string> {
    const cookieStore = await cookies();
    const username = cookieStore.get('username')?.value;

    // 🔍 ターミナルで確認するためのログ
    console.log("=== [AuthService] デバッグ開始 ===");
    console.log("取得したクッキー(username):", username);

    if (!username) {
      console.log("❌ 結果: クッキーが空のためGuestを表示します");
      return "Guest";
    }

    const displayName = await this.userRepo.getDisplayName(username);
    console.log("取得した表示名(displayName):", displayName);
    console.log("=== [AuthService] デバッグ終了 ===");
    
    return displayName;
  }
}