import React, { useState } from 'react';
import { Message } from '../types';
import { format } from 'date-fns';
import { SmilePlus, Reply, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGrouped?: boolean;
}

export function MessageBubble({ message, isOwn, isGrouped = false }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with simple code block detection
  const renderContent = (text: string) => {
    // Check for code blocks ```code```
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);
    
    // If no code blocks, just return text
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
      // Even indices are normal text, odd are code
      if (index % 2 === 1) {
        return (
          <div key={index} className="my-2 bg-[#2b2d31] rounded-md border border-[#1e1f22] overflow-hidden">
             <div className="bg-[#1e1f22] px-3 py-1 text-[10px] text-[#949ba4] font-mono border-b border-[#2b2d31] flex justify-between items-center">
               <span>code</span>
               <span className="text-[9px] uppercase tracking-wider">cpp</span>
             </div>
             <pre className="p-3 overflow-x-auto text-sm font-mono text-[#dcd7ba] whitespace-pre">
               {part}
             </pre>
          </div>
        );
      }
      // Handle inline code `code`
      const inlineParts = part.split(/`([^`]+)`/g);
      return (
        <span key={index}>
          {inlineParts.map((subPart, subIndex) => 
            subIndex % 2 === 1 
              ? <code key={subIndex} className="bg-[#2b2d31] px-1 py-0.5 rounded text-[13px] font-mono text-[#dbdee1]">{subPart}</code>
              : subPart
          )}
        </span>
      );
    });
  };

  if (message.isSystem) {
    return (
      <div className="flex items-center gap-4 px-4 py-1 mt-4 mb-2 group hover:bg-[rgba(0,0,0,0.02)]">
        <div className="flex-1 h-px bg-[#3f4147]" />
        <span className="text-[#949ba4] text-xs font-bold">{format(message.timestamp, 'MMMM d, yyyy')}</span>
        <div className="flex-1 h-px bg-[#3f4147]" />
        <div className="flex items-center gap-2 text-[#949ba4] text-[13px]">
          <span className="font-semibold text-[#23a559] cursor-pointer hover:underline">System</span> 
          <span>{message.text}</span>
          <span className="text-[10px] text-[#5e636e] ml-1">{format(message.timestamp, 'h:mm aa')}</span>
        </div>
      </div>
    );
  }

  // Consistent Avatar Color Generator
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div 
      className={`group flex px-4 pr-8 hover:bg-[#2e3035] transition-colors relative ${isGrouped ? 'py-[2px] mt-0' : 'py-[2px] mt-[17px]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar or Time Hover */}
      <div className="w-[50px] shrink-0 cursor-pointer flex justify-start pt-[2px]">
        {isGrouped ? (
          <span className="text-[10px] text-[#949ba4] hidden group-hover:block ml-2 w-full text-left font-mono">
            {format(message.timestamp, 'h:mm aa')}
          </span>
        ) : (
          <div className={`w-10 h-10 rounded-full ${getAvatarColor(message.senderName)} flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity active:translate-y-[1px]`}>
            {message.senderName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {!isGrouped && (
          <div className="flex items-center gap-2 mb-0.5">
            <span 
              className={`font-medium text-[16px] cursor-pointer hover:underline ${
                isOwn ? 'text-[#dbdee1]' : 'text-[#f23f43]' // Admin/Professor color diff?
              }`}
            >
              {message.senderName}
            </span>
            <span className="text-[11px] text-[#949ba4] font-medium ml-1">
              {format(message.timestamp, 'MM/dd/yyyy h:mm aa')}
            </span>
          </div>
        )}
        
        <div className={`text-[#dbdee1] text-[15px] leading-[1.375rem] whitespace-pre-wrap ${isGrouped ? '' : ''}`}>
          {renderContent(message.text)}
        </div>
      </div>

      {/* Floating Action Bar */}
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute -top-3 right-4 bg-[#313338] border border-[#26272d] rounded-md shadow-sm flex items-center p-0.5 z-10"
        >
          <button className="p-1.5 hover:bg-[#404249] rounded cursor-pointer group/btn relative" title="Add Reaction">
            <SmilePlus className="w-4 h-4 text-[#b5bac1] group-hover/btn:text-[#dbdee1]" />
          </button>
          <button className="p-1.5 hover:bg-[#404249] rounded cursor-pointer group/btn" title="Reply">
            <Reply className="w-4 h-4 text-[#b5bac1] group-hover/btn:text-[#dbdee1]" />
          </button>
          <button 
            className="p-1.5 hover:bg-[#404249] rounded cursor-pointer group/btn" 
            title="Copy Text"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[#b5bac1] group-hover/btn:text-[#dbdee1]" />}
          </button>
        </motion.div>
      )}
    </div>
  );
}
