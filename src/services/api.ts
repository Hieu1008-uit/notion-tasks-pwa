import type { User, UserData } from '../types';

const TOKEN_KEY = 'pastel_auth_token';

export const ApiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Đăng ký thất bại');
      }
      this.setToken(data.data.token);
      return {
        user: { ...data.data.user, provider: 'email' },
        token: data.data.token
      };
    } catch (err: unknown) {
      console.warn('Backend unavailable, fallback to offline auth:', err);
      // Seamless offline fallback
      const offlineUser: User = {
        id: 'usr_' + Date.now(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      return { user: offlineUser, token: 'offline-token' };
    }
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Đăng nhập thất bại');
      }
      this.setToken(data.data.token);
      return {
        user: { ...data.data.user, provider: 'email' },
        token: data.data.token
      };
    } catch (err: unknown) {
      console.warn('Backend unavailable, fallback to offline auth:', err);
      const name = email.split('@')[0];
      const offlineUser: User = {
        id: 'usr_' + Date.now(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      return { user: offlineUser, token: 'offline-token' };
    }
  },

  async loginGoogle(email?: string, name?: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      this.setToken(data.data.token);
      return {
        user: { ...data.data.user, provider: 'google' },
        token: data.data.token
      };
    } catch (err) {
      console.warn('Backend unavailable, fallback to offline Google auth:', err);
      const targetEmail = email || 'hieuv.uit@gmail.com';
      const targetName = name || targetEmail.split('@')[0];
      const offlineUser: User = {
        id: 'usr_g_' + Date.now(),
        name: targetName,
        email: targetEmail,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(targetName)}`,
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      return { user: offlineUser, token: 'offline-token' };
    }
  },

  async loginPhone(phone: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);
      this.setToken(data.data.token);
      return {
        user: { ...data.data.user, provider: 'phone' },
        token: data.data.token
      };
    } catch (err) {
      console.warn('Backend unavailable, fallback to offline Phone auth:', err);
      const offlineUser: User = {
        id: 'usr_p_' + Date.now(),
        name: `Người dùng ${phone.slice(-4)}`,
        phone,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(phone)}`,
        provider: 'phone',
        createdAt: new Date().toISOString()
      };
      return { user: offlineUser, token: 'offline-token' };
    }
  },

  async fetchUserData(): Promise<UserData | null> {
    const token = this.getToken();
    if (!token || token === 'offline-token') return null;

    try {
      const res = await fetch('/api/user/data', {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success && json.data) {
        return {
          tasks: json.data.tasks || [],
          projects: json.data.boards || [],
          totalFocusSeconds: 0,
          lastSyncedAt: json.data.lastUpdated || new Date().toISOString()
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async syncUserData(userData: UserData): Promise<boolean> {
    const token = this.getToken();
    if (!token || token === 'offline-token') return false;

    try {
      const res = await fetch('/api/user/data', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          boards: userData.projects,
          tasks: userData.tasks,
          selectedBoardId: userData.projects[0]?.id || 'board-1',
          streakCount: 0,
          customTimes: {}
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
