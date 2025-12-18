import React, { useState } from 'react';
import { TrendingUp, Hash, Users } from 'lucide-react';
import SearchBar from './SearchBar';
import VerificationBadge from './VerificationBadge';

interface MobileSearchPageProps {
  onUserSelect: (handle: string) => void;
}

const MobileSearchPage: React.FC<MobileSearchPageProps> = ({ onUserSelect }) => {
  const [activeSection, setActiveSection] = useState<'trending' | 'users'>('trending');

  const trendingTopics = [
    { tag: 'Bluesky', count: 15420 },
    { tag: 'AI', count: 8930 },
    { tag: 'Web3', count: 6750 },
    { tag: 'React', count: 5240 },
    { tag: 'TypeScript', count: 4180 },
    { tag: 'OpenAI', count: 3920 },
    { tag: 'JavaScript', count: 3650 },
    { tag: 'Python', count: 2890 },
  ];

  const suggestedUsers = [
    { handle: 'alice.bsky.social', name: 'Alice Johnson', followers: '1.2K' },
    { handle: 'bob.bsky.social', name: 'Bob Smith', followers: '856' },
    { handle: 'charlie.bsky.social', name: 'Charlie Brown', followers: '2.1K' },
    { handle: 'diana.bsky.social', name: 'Diana Prince', followers: '3.4K' },
  ];

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="pb-20">
      {/* 検索バー */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <SearchBar onUserSelect={onUserSelect} />
      </div>

      {/* セクション切り替え */}
      <div className="flex border-b border-gray-200 bg-white sticky top-16 z-10">
        <button
          onClick={() => setActiveSection('trending')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeSection === 'trending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Hash className="h-5 w-5 inline mr-2" />
          トレンド
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeSection === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-5 w-5 inline mr-2" />
          ユーザー
        </button>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {activeSection === 'trending' ? (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              今話題のトピック
            </h3>
            {trendingTopics.map((topic, index) => (
              <div key={topic.tag} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 font-medium w-6">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">#{topic.tag}</p>
                    <p className="text-sm text-gray-500">
                      {formatCount(topic.count)} 投稿
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              おすすめユーザー
            </h3>
            {suggestedUsers.map((user) => (
              <div key={user.handle} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center space-x-1">
                      <span>{user.name}</span>
                      <VerificationBadge handle={user.handle} size="sm" />
                    </p>
                    <p className="text-sm text-gray-500">@{user.handle}</p>
                    <p className="text-xs text-gray-400">{user.followers} フォロワー</p>
                  </div>
                </div>
                <button
                  onClick={() => onUserSelect(user.handle)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  プロフィール
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchPage;
