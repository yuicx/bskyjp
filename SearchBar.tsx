import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import BlueskyService from '../services/bluesky';
import type { BlueskyProfile } from '../types/bluesky';

interface SearchBarProps {
  onUserSelect: (handle: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlueskyProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const blueskyService = new BlueskyService();

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await blueskyService.searchUsers(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleUserClick = (handle: string) => {
    setQuery('');
    setShowResults(false);
    onUserSelect(handle);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ユーザーを検索..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <button
                key={user.did}
                onClick={() => handleUserClick(user.handle)}
                className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 text-left"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.displayName || user.handle}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {(user.displayName || user.handle)[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user.displayName || user.handle}
                  </p>
                  <p className="text-sm text-gray-500 truncate">@{user.handle}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              ユーザーが見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;