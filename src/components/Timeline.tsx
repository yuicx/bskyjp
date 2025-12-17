import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import BlueskyService from '../services/bluesky';
import Post from './Post';
import type { BlueskyPost } from '../types/bluesky';

const Timeline: React.FC = () => {
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
  }, []);

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
    <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-2xl shadow-sm">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">ホーム</h1>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div>
        {posts.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            投稿が見つかりませんでした
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
    </div>
  );
};

export default Timeline;
