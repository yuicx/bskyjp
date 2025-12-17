import React, { useEffect, useState } from 'react';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import BlueskyService from '../services/bluesky';
import type { BlueskyProfile, UserJoinDate } from '../types/bluesky';

interface ProfilePageProps {
  handle: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ handle }) => {
  const [profile, setProfile] = useState<BlueskyProfile | null>(null);
  const [joinDate, setJoinDate] = useState<UserJoinDate | null>(null);
  const [loading, setLoading] = useState(true);
  
  const blueskyService = new BlueskyService();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      
      try {
        const [profileData, joinDateData] = await Promise.all([
          blueskyService.getProfile(handle),
          blueskyService.getUserJoinDate(handle)
        ]);
        
        setProfile(profileData);
        setJoinDate(joinDateData);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [handle]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <div className="text-center p-8 text-gray-500">
          プロフィールが見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-2xl shadow-sm overflow-hidden">
      {/* バナー */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-cyan-400 relative">
        {profile.banner && (
          <img 
            src={profile.banner} 
            alt="バナー" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* プロフィール情報 */}
      <div className="relative px-4 pb-4">
        {/* アバター */}
        <div className="absolute -top-16 left-4">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.displayName || profile.handle}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
              <span className="text-4xl text-gray-600 font-medium">
                {(profile.displayName || profile.handle)[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="pt-20">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.displayName || profile.handle}
            </h1>
            <p className="text-gray-600">@{profile.handle}</p>
          </div>

          {profile.description && (
            <p className="text-gray-900 mb-4 leading-relaxed">
              {profile.description}
            </p>
          )}

          {/* Bluesky参加日表示（差別化機能） */}
          {joinDate && (
            <div className="flex items-center space-x-2 text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                {joinDate.formatted}
              </span>
            </div>
          )}

          {/* 統計情報 */}
          <div className="flex space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900 font-semibold">{profile.postsCount || 0}</span>
              <span className="text-gray-600">投稿</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900 font-semibold">{profile.followsCount || 0}</span>
              <span className="text-gray-600">フォロー中</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900 font-semibold">{profile.followersCount || 0}</span>
              <span className="text-gray-600">フォロワー</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;