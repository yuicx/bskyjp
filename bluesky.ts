export interface BlueskyProfile {
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  banner?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  createdAt?: string;
}

export interface BlueskyPost {
  uri: string;
  cid: string;
  author: BlueskyProfile;
  record: {
    text: string;
    createdAt: string;
    reply?: {
      parent: {
        uri: string;
      };
    };
  };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  indexedAt: string;
  viewer?: {
    like?: string;
    repost?: string;
  };
}

export interface AuthSession {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
}

export interface UserJoinDate {
  handle: string;
  joinDate: Date;
  formatted: string;
}