import React from 'react';
import { Home, Search, Bell, User } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  notificationCount = 0 
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'ホーム' },
    { id: 'search', icon: Search, label: '検索' },
    { id: 'notifications', icon: Bell, label: '通知', badge: notificationCount },
    { id: 'profile', icon: User, label: 'プロフィール' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors relative ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : ''}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
