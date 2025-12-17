import React, { useState } from 'react';
import { X, Image, Smile, MapPin, Calendar } from 'lucide-react';
import BlueskyService from '../services/bluesky';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const blueskyService = new BlueskyService();
  const maxLength = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const success = await blueskyService.createPost(text);
      if (success) {
        setText('');
        onPostCreated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">新しい投稿</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="今何してる？"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={maxLength}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-blue-500">
              <button type="button" className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                <Image className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                <MapPin className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                <Calendar className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${text.length > maxLength * 0.8 ? 'text-red-500' : 'text-gray-500'}`}>
                {text.length}/{maxLength}
              </span>
              <button
                type="submit"
                disabled={!text.trim() || isPosting || text.length > maxLength}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                {isPosting ? '投稿中...' : '投稿'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
