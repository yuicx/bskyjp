import React, { useEffect, useState } from 'react';
import { RefreshCw, CreditCard as Edit } from 'lucide-react';
import BlueskyService from '../services/bluesky';
import Post from './Post';
import type { BlueskyPost } from '../types/bluesky';

interface MobileTimelineProps {
  feedType: 'following' | 'discover';
  onComposeClick: () => void;
}

const MobileTimeline: React.FC<MobileTimelineProps> = ({ feedType, onComposeClick }) => {
  const [posts, setPosts] = useState<BlueskyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const blueskyService = new BlueskyService();

  const loadPosts = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const newPosts = await blueskyService.getTimeline(50);
      setPosts(newPosts);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [feedType]);

  const handleRefresh = () => {
    loadPosts(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* プルトゥリフレッシュインジケーター */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-10">
        <h2 className="font-bold text-gray-900">
          {feedType === 'following' ? 'Following' : 'Discover'}
        </h2>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* 投稿リスト */}
      <div className="pb-20">
        {posts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>投稿が見つかりませんでした</p>
          </div>
        ) : (
          posts.map((post) => (
            <Post 
              key={post.uri} 
              post={post} 
              onUpdate={() => loadPosts()} 
            />
          ))
        )}
      </div>

      {/* フローティング投稿ボタン */}
      <button
        onClick={onComposeClick}
        className="fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
      >
        <Edit className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MobileTimeline;
