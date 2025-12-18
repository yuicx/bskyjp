import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Timeline from './components/Timeline';
import ProfilePage from './components/ProfilePage';
import NotificationPanel from './components/NotificationPanel';
import ComposeModal from './components/ComposeModal';
import MobileHeader from './components/MobileHeader';
import MobileNavigation from './components/MobileNavigation';
import MobileSidebar from './components/MobileSidebar';
import MobileTimeline from './components/MobileTimeline';
import MobileSearchPage from './components/MobileSearchPage';
import TrendingPanel from './components/TrendingPanel';
import { LogOut, User, Home, Bell, CreditCard as Edit, Search, Hash } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [showComposeModal, setShowComposeModal] = React.useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const [feedType, setFeedType] = React.useState<'following' | 'discover'>('following');
  const navigate = useNavigate();

  // モバイル検出
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // モバイル版のレンダリング
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <MobileHeader 
          onMenuToggle={() => setShowMobileSidebar(true)}
          activeTab={feedType}
          onTabChange={setFeedType}
        />
        
        <main className="bg-white min-h-screen">
          <Routes>
            <Route path="/" element={<MobileTimeline feedType={feedType} onComposeClick={() => setShowComposeModal(true)} />} />
            <Route path="/search" element={<MobileSearchPage onUserSelect={(handle) => navigate(`/profile/${handle}`)} />} />
            <Route path="/notifications" element={<NotificationPanel />} />
            <Route path="/profile/:handle" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <MobileNavigation activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); navigate(tab === 'home' ? '/' : `/${tab}`); }} />
        <MobileSidebar isOpen={showMobileSidebar} onClose={() => setShowMobileSidebar(false)} />
        <ComposeModal isOpen={showComposeModal} onClose={() => setShowComposeModal(false)} onPostCreated={() => window.location.reload()} />
      </div>
    );
  }

  // デスクトップ版のレンダリング
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/bskyjp.svg" 
                  alt="Bskyjp" 
                  className="h-8 w-8"
                />
              </div>
              <nav className="flex space-x-4">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    navigate('/');
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                    activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  } rounded-lg`}
                >
                  <Home className="h-5 w-5" />
                  <span>ホーム</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    navigate('/notifications');
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                    activeTab === 'notifications' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  } rounded-lg`}
                >
                  <Bell className="h-5 w-5" />
                  <span>通知</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('search');
                    navigate('/search');
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                    activeTab === 'search' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  } rounded-lg`}
                >
                  <Search className="h-5 w-5" />
                  <span>検索</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    navigate(`/profile/${user?.handle}`);
                  }}
                  className={`flex items-center space-x-1 px-3 py-2 transition-colors ${
                    activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  } rounded-lg`}
                >
                  <User className="h-5 w-5" />
                  <span>プロフィール</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowComposeModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>投稿</span>
              </button>
              <span className="text-gray-700">@{user?.handle}</span>
              <button 
                onClick={() => logout()}
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<Timeline />} />
              <Route path="/notifications" element={<NotificationPanel />} />
              <Route 
                path="/search" 
                element={
                  <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-2xl shadow-sm">
                    <div className="p-6">
                      <h1 className="text-xl font-bold text-gray-900 mb-6">検索</h1>
                      <MobileSearchPage onUserSelect={(handle) => navigate(`/profile/${handle}`)} />
                    </div>
                  </div>
                } 
              />
              <Route 
                path="/profile/:handle" 
                element={<ProfilePage />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          
          <div className="hidden lg:block space-y-6">
            <TrendingPanel />
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">おすすめユーザー</h3>
              <div className="space-y-3">
                {['alice.bsky.social', 'bob.bsky.social', 'charlie.bsky.social'].map((handle) => (
                  <div key={handle} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      <span className="text-sm font-medium text-gray-900">@{handle}</span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                      フォロー
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ComposeModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onPostCreated={() => {
          window.location.reload();
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
