import React, { useRef, useEffect, useState } from 'react';
import { Message, User, Channel } from '../types';
import { MessageBubble } from './MessageBubble';
import { 
  Paperclip, Smile, Hash, Bell, Pin, Users, HelpCircle, 
  Inbox, Gift, Sticker 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ChatWindowProps {
  messages: Message[];
  currentUser: User | null;
  activeChannel: Channel;
  onSendMessage: (text: string) => void;
  onlineCount: number;
  isTyping?: boolean;
}

export function ChatWindow({ messages, currentUser, activeChannel, onSendMessage, onlineCount, isTyping = false }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeChannel]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChannel]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
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
    <div className="flex flex-col flex-1 h-full bg-[#313338] relative overflow-hidden">
      {/* Header */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-[#26272d] bg-[#313338] shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Hash className="w-5 h-5 text-[#80848e]" />
          <h3 className="font-bold text-[#f2f3f5] text-[16px] truncate">{activeChannel.name}</h3>
          {activeChannel.description && (
            <>
              <div className="w-px h-4 bg-[#3f4147] mx-2 hidden md:block" />
              <p className="text-xs text-[#949ba4] truncate hidden md:block max-w-md">
                {activeChannel.description}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-[#b5bac1]">
          <div className="hidden md:flex items-center gap-4">
            <Bell className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
            <Pin className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
            <Users className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer text-[#dbdee1]" /> {/* Active State */}
          </div>
          
          <div className="relative md:block hidden">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-[#1e1f22] text-[#dbdee1] text-xs px-2 py-1 rounded-[4px] w-36 transition-all focus:w-60 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
            <HelpCircle className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 custom-scrollbar flex flex-col">
        {/* Welcome Message for Channel */}
        <div className="mt-auto mb-6 px-4">
          <div className="w-16 h-16 bg-[#41434a] rounded-full flex items-center justify-center mb-4">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{activeChannel.name}!</h1>
          <p className="text-[#b5bac1]">
            This is the start of the <span className="font-medium text-white">#{activeChannel.name}</span> channel. 
            {activeChannel.description || "Let's get this conversation started!"}
          </p>
        </div>

        {/* Message List */}
        <div className="flex flex-col pb-4">
          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            // Group if same user and less than 5 mins difference
            const isSameUser = prevMsg && 
                              prevMsg.senderId === msg.senderId && 
                              !prevMsg.isSystem &&
                              !msg.isSystem &&
                              (msg.timestamp.getTime() - prevMsg.timestamp.getTime() < 5 * 60 * 1000);
            
            return (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isOwn={currentUser?.id === msg.senderId}
                isGrouped={!!isSameUser}
              />
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-4 py-2 flex items-center gap-1">
              <div className="flex space-x-1 items-center h-4">
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 bg-[#dbdee1] rounded-full" 
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-[#dbdee1] rounded-full" 
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-[#dbdee1] rounded-full" 
                />
              </div>
              <span className="text-xs text-[#dbdee1] font-bold ml-2">Someone is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6 pt-2 bg-[#313338] z-20 shrink-0">
        <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex flex-col gap-2">
          
          <div className="flex items-center gap-3">
            <button className="text-[#b5bac1] hover:text-[#dbdee1] bg-[#313338] p-1 rounded-full">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-[#dbdee1] placeholder-[#949ba4] outline-none text-[15px] h-auto min-h-[24px]"
              placeholder={`Message #${activeChannel.name}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            <div className="flex items-center gap-3 text-[#b5bac1]">
              <Gift className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
              <Sticker className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
              <Smile className="w-5 h-5 hover:text-[#dbdee1] cursor-pointer" />
            </div>
          </div>
        </div>
        
        {/* Typing Tips */}
        {inputText.length > 0 && (
          <div className="text-right mt-1 text-[10px] text-[#949ba4]">
            <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline
          </div>
        )}
      </div>
    </div>
  );
}
