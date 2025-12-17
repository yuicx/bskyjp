import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import BlueskyService from '../services/bluesky';
import type { BlueskyPost } from '../types/bluesky';

interface PostProps {
  post: BlueskyPost;
  onUpdate?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  
  const blueskyService = new BlueskyService();

  const handleLike = async () => {
    setIsLiking(true);
    await blueskyService.likePost(post.uri, post.cid);
    setIsLiking(false);
    onUpdate?.();
  };

  const handleRepost = async () => {
    setIsReposting(true);
    await blueskyService.repost(post.uri, post.cid);
    setIsReposting(false);
    onUpdate?.();
  };

  const timeAgo = formatDistanceToNow(new Date(post.record.createdAt), {
    addSuffix: true,
    locale: ja
  });

  return (
    <article className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {post.author.avatar ? (
          <img 
            src={post.author.avatar} 
            alt={post.author.displayName || post.author.handle}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {(post.author.displayName || post.author.handle)[0].toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {post.author.displayName || post.author.handle}
            </h3>
            <span className="text-gray-500 text-sm">@{post.author.handle}</span>
            <span className="text-gray-500 text-sm">·</span>
            <time className="text-gray-500 text-sm" title={post.record.createdAt}>
              {timeAgo}
            </time>
          </div>
          
          <p className="text-gray-900 leading-relaxed mb-3 whitespace-pre-wrap">
            {post.record.text}
          </p>
          
          <div className="flex items-center space-x-8 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-sm">{post.replyCount}</span>
            </button>
            
            <button 
              onClick={handleRepost}
              disabled={isReposting}
              className={`flex items-center space-x-2 hover:text-green-500 transition-colors group ${post.viewer?.repost ? 'text-green-500' : ''}`}
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat2 className="h-5 w-5" />
              </div>
              <span className="text-sm">{post.repostCount}</span>
            </button>
            
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 hover:text-red-500 transition-colors group ${post.viewer?.like ? 'text-red-500' : ''}`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <Heart className={`h-5 w-5 ${post.viewer?.like ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{post.likeCount}</span>
            </button>
            
            <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;