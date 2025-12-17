import { BskyAgent } from '@atproto/api';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import AuthService from './auth';
import type { BlueskyPost, BlueskyProfile, UserJoinDate } from '../types/bluesky';

class BlueskyService {
  private agent: BskyAgent;

  constructor() {
    this.agent = AuthService.getInstance().getAgent();
  }

  async getTimeline(limit: number = 30): Promise<BlueskyPost[]> {
    try {
      const response = await this.agent.getTimeline({ limit });
      return response.data.feed.map(item => ({
        uri: item.post.uri,
        cid: item.post.cid,
        author: {
          did: item.post.author.did,
          handle: item.post.author.handle,
          displayName: item.post.author.displayName,
          avatar: item.post.author.avatar,
        },
        record: item.post.record as any,
        replyCount: item.post.replyCount || 0,
        repostCount: item.post.repostCount || 0,
        likeCount: item.post.likeCount || 0,
        indexedAt: item.post.indexedAt,
        viewer: item.post.viewer,
      }));
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
      return [];
    }
  }

  async createPost(text: string): Promise<boolean> {
    try {
      await this.agent.post({
        text,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error('Failed to create post:', error);
      return false;
    }
  }

  async likePost(uri: string, cid: string): Promise<boolean> {
    try {
      await this.agent.like(uri, cid);
      return true;
    } catch (error) {
      console.error('Failed to like post:', error);
      return false;
    }
  }

  async repost(uri: string, cid: string): Promise<boolean> {
    try {
      await this.agent.repost(uri, cid);
      return true;
    } catch (error) {
      console.error('Failed to repost:', error);
      return false;
    }
  }

  async getProfile(actor: string): Promise<BlueskyProfile | null> {
    try {
      const response = await this.agent.getProfile({ actor });
      return {
        did: response.data.did,
        handle: response.data.handle,
        displayName: response.data.displayName,
        description: response.data.description,
        avatar: response.data.avatar,
        banner: response.data.banner,
        followersCount: response.data.followersCount,
        followsCount: response.data.followsCount,
        postsCount: response.data.postsCount,
        createdAt: response.data.createdAt,
      };
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }

  async searchUsers(query: string): Promise<BlueskyProfile[]> {
    try {
      const response = await this.agent.searchActors({
        term: query,
        limit: 10
      });
      
      return response.data.actors.map(actor => ({
        did: actor.did,
        handle: actor.handle,
        displayName: actor.displayName,
        description: actor.description,
        avatar: actor.avatar,
        followersCount: actor.followersCount,
        followsCount: actor.followsCount,
        postsCount: actor.postsCount,
      }));
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }

  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.agent.listNotifications({ limit: 50 });
      return response.data.notifications.map(notif => ({
        id: notif.uri,
        type: notif.reason,
        author: {
          handle: notif.author.handle,
          displayName: notif.author.displayName,
          avatar: notif.author.avatar,
        },
        createdAt: notif.indexedAt,
        post: notif.record ? { text: (notif.record as any).text } : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  /**
   * ユーザーのBluesky参加日を取得する関数（コア機能）
   * @param handle - ユーザーのハンドル名
   * @returns ユーザーの参加日情報
   */
  async getUserJoinDate(handle: string): Promise<UserJoinDate | null> {
    try {
      // ユーザーの投稿履歴を最古から取得
      const response = await this.agent.getAuthorFeed({
        actor: handle,
        limit: 100, // 最大100件の投稿を取得
      });

      if (response.data.feed.length === 0) {
        return null; // 投稿が見つからない場合
      }

      // 最古の投稿を特定
      const oldestPost = response.data.feed
        .map(item => ({
          createdAt: new Date(item.post.record.createdAt as string)
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

      if (!oldestPost) {
        return null;
      }

      const joinDate = oldestPost.createdAt;
      const formatted = format(joinDate, 'yyyy年M月からBlueskyに参加', { 
        locale: ja 
      });

      return {
        handle,
        joinDate,
        formatted
      };

    } catch (error) {
      console.error(`Failed to get join date for ${handle}:`, error);
      return null;
    }
  }
}

export default BlueskyService;