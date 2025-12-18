import React from 'react';
import { X, Settings, HelpCircle, LogOut, User, Bookmark, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VerificationBadge from './VerificationBadge';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: User, label: 'プロフィール', action: () => {} },
    { icon: Bookmark, label: 'ブックマーク', action: () => {} },
    { icon: List, label: 'リスト', action: () => {} },
    { icon: Settings, label: '設定', action: () => {} },
    { icon: HelpCircle, label: 'ヘルプ', action: () => {} },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* サイドバー */}
      <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img 
                src="/bskyjp.svg" 
                alt="Bskyjp" 
                className="h-8 w-8"
              />
              <span className="text-lg font-bold text-gray-900">Bskyjp</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* ユーザー情報 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {user?.handle?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 flex items-center space-x-1">
                  <span>@{user?.handle}</span>
                  <VerificationBadge handle={user?.handle || ''} size="sm" />
                </p>
                <p className="text-sm text-gray-500">Blueskyユーザー</p>
              </div>
            </div>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span><strong>0</strong> フォロー中</span>
              <span><strong>0</strong> フォロワー</span>
            </div>
          </div>

          {/* メニューアイテム */}
          <div className="flex-1 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-900">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ログアウト */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-6 w-6" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
