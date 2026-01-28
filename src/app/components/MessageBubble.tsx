import React from 'react';
import { Message } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-slate-100 text-slate-500 text-xs py-1 px-3 rounded-full border border-slate-200">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[75%] md:max-w-[60%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-end gap-2">
          {!isOwn && (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0 mb-1">
              {message.senderName.slice(0, 2).toUpperCase()}
            </div>
          )}
          
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
              isOwn
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            }`}
          >
            {!isOwn && (
              <p className="text-xs font-bold text-indigo-600 mb-1 block">
                {message.senderName}
              </p>
            )}
            <p className="leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        </div>
        
        <span className={`text-[10px] text-slate-400 mt-1 px-1 ${isOwn ? 'mr-1' : 'ml-10'}`}>
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </motion.div>
  );
}
