import { BskyAgent } from '@atproto/api';

class AuthService {
  private agent: BskyAgent;
  private static instance: AuthService;

  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    
    // セッション復元を試行
    this.restoreSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(identifier: string, password: string): Promise<boolean> {
    try {
      const response = await this.agent.login({ identifier, password });
      
      if (response.success) {
        // セッション情報をlocalStorageに保存
        localStorage.setItem('bluesky_session', JSON.stringify({
          accessJwt: this.agent.session?.accessJwt,
          refreshJwt: this.agent.session?.refreshJwt,
          handle: this.agent.session?.handle,
          did: this.agent.session?.did
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('bluesky_session');
    this.agent.session = undefined;
  }

  private async restoreSession(): Promise<void> {
    try {
      const sessionData = localStorage.getItem('bluesky_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        await this.agent.resumeSession(session);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem('bluesky_session');
    }
  }

  getAgent(): BskyAgent {
    return this.agent;
  }

  isAuthenticated(): boolean {
    return !!this.agent.session;
  }

  getCurrentUser() {
    return this.agent.session;
  }
}

export default AuthService;
