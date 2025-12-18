import React, { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  activeTab: 'following' | 'discover';
  onTabChange: (tab: 'following' | 'discover') => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle, activeTab, onTabChange }) => {
  const [showTabMenu, setShowTabMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* ハンバーガーメニュー */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* ロゴ */}
        <div className="flex items-center">
          <img 
            src="/bskyjp.svg" 
            alt="Bskyjp" 
            className="h-8 w-8"
          />
        </div>

        {/* タブ切り替えボタン */}
        <div className="relative">
          <button
            onClick={() => setShowTabMenu(!showTabMenu)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Sparkles className={`h-6 w-6 ${activeTab === 'discover' ? 'text-purple-500' : 'text-gray-700'}`} />
          </button>

          {/* タブメニュー */}
          {showTabMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px]">
              <button
                onClick={() => {
                  onTabChange('following');
                  setShowTabMenu(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === 'following' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                Following
              </button>
              <button
                onClick={() => {
                  onTabChange('discover');
                  setShowTabMenu(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === 'discover' ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                }`}
              >
                Discover
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
