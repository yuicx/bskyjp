import React, { useEffect, useState } from 'react';
import { TrendingUp, Hash } from 'lucide-react';

interface TrendingTopic {
  tag: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

const TrendingPanel: React.FC = () => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // モックデータ（実際のAPIが利用可能になったら置き換え）
    const mockTrends: TrendingTopic[] = [
      { tag: 'Bluesky', count: 15420, trend: 'up' },
      { tag: 'AI', count: 8930, trend: 'up' },
      { tag: 'Web3', count: 6750, trend: 'stable' },
      { tag: 'React', count: 5240, trend: 'up' },
      { tag: 'TypeScript', count: 4180, trend: 'stable' },
      { tag: 'OpenAI', count: 3920, trend: 'down' },
      { tag: 'JavaScript', count: 3650, trend: 'up' },
      { tag: 'Python', count: 2890, trend: 'stable' },
    ];

    setTimeout(() => {
      setTrends(mockTrends);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">トレンド</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Hash className="h-5 w-5 mr-2 text-blue-500" />
        トレンド
      </h2>
      
      <div className="space-y-3">
        {trends.map((trend, index) => (
          <div key={trend.tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 font-medium w-6">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-gray-900">#{trend.tag}</p>
                <p className="text-sm text-gray-500">
                  {formatCount(trend.count)} 投稿
                </p>
              </div>
            </div>
            {getTrendIcon(trend.trend)}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
        もっと見る
      </button>
    </div>
  );
};

export default TrendingPanel;
