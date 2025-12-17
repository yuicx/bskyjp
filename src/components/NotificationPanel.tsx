import React, { useEffect, useState } from 'react';
import { Bell, Heart, MessageCircle, Repeat2, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import BlueskyService from '../services/bluesky';

interface Notification {
  id: string;
  type: 'like' | 'repost' | 'reply' | 'follow';
  author: {
    handle: string;
    displayName?: string;
    avatar?: string;
  };
  createdAt: string;
  post?: {
    text: string;
  };
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  const blueskyService = new BlueskyService();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifs = await blueskyService.getNotifications();
        setNotifications(notifs);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'repost':
        return <Repeat2 className="h-5 w-5 text-green-500" />;
      case 'reply':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const name = notification.author.displayName || notification.author.handle;
    switch (notification.type) {
      case 'like':
        return `${name}があなたの投稿にいいねしました`;
      case 'repost':
        return `${name}があなたの投稿をリポストしました`;
      case 'reply':
        return `${name}があなたの投稿に返信しました`;
      case 'follow':
        return `${name}があなたをフォローしました`;
      default:
        return `${name}からの通知`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">通知</h1>
      </div>
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>新しい通知はありません</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {notification.author.avatar ? (
                      <img 
                        src={notification.author.avatar} 
                        alt={notification.author.displayName || notification.author.handle}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-600 font-medium">
                          {(notification.author.displayName || notification.author.handle)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ja
                      })}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 mb-2">
                    {getNotificationText(notification)}
                  </p>
                  
                  {notification.post && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm">
                        {notification.post.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
