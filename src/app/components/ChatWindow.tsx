import React, { useRef, useEffect, useState } from 'react';
import { Message, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { Send, Paperclip, Smile, Image as ImageIcon, MoreVertical, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatWindowProps {
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (text: string) => void;
  onlineCount: number;
}

export function ChatWindow({ messages, currentUser, onSendMessage, onlineCount }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      // Keep focus
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#f0f2f5] relative overflow-hidden">
      {/* Header */}
      <header className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              <span className="text-lg">#</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">General Chat</h1>
            <p className="text-xs text-slate-500 font-medium">
              {onlineCount} users online • Server Connected
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <button className="hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]"
      >
        <div className="max-w-4xl mx-auto w-full pb-2">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isOwn={currentUser?.id === msg.senderId} 
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto w-full">
          <form 
            onSubmit={handleSend}
            className="flex items-end gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-1 px-1 pb-2 text-slate-400">
              <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors hover:text-slate-600">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors hover:text-slate-600">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 py-3 min-h-[44px] max-h-32 resize-none"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl flex items-center justify-center transition-all mb-0.5 ${
                inputText.trim() 
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
