import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  remainingTurns: number;
  isGameOver: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, remainingTurns, isGameOver }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGameOver) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-xl z-10 w-full md:w-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-xl font-bold text-white">未来の旭市ビルダー</h1>
            <div className="flex justify-between items-center mt-2">
                <p className="text-teal-50 text-xs">チャットで夢の街をデザイン</p>
                <div className={`text-xs font-bold px-2 py-1 rounded bg-black/20 text-white ${remainingTurns <= 3 ? 'text-red-200 animate-pulse' : ''}`}>
                    建設残り: {remainingTurns}枠
                </div>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
            ようこそ！私は旭市の未来を作るAIアーキテクトです。
            <br/>
            あと<span className="font-bold text-blue-600">{remainingTurns}個</span>の建物を建設して、人口100万人を目指しましょう！
            <br/><br/>
            例：
            <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>「海沿いに巨大なリゾートホテルを建てて」</li>
                <li>「灯台から港までジップラインを繋げたい」</li>
            </ul>
        </div>
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGameOver ? "建設終了！結果を確認してください" : "夢のアイデアを入力..."}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-200 disabled:text-gray-500"
            disabled={isLoading || isGameOver}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isGameOver}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
