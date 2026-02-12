import React, { useState } from 'react';
import { User, Channel } from '../types';
import { 
  Hash, 
  Settings, 
  Plus, 
  ChevronDown, 
  Mic, 
  Headphones,
  Search,
  VolumeX,
  MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  users: User[];
  currentUser: User | null;
  activeChannel: Channel;
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ users, currentUser, activeChannel, channels, onChannelSelect, onOpenSettings }: SidebarProps) {
  const [collapsedCategories, setCollapsedChannels] = useState<Record<string, boolean>>({});
  const [isMicMuted, setMicMuted] = useState(false);
  const [isDeafened, setDeafened] = useState(false);

  const toggleCategory = (cat: string) => {
    setCollapsedChannels(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

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
    <div className="w-[300px] bg-[#1e1f22] flex flex-col h-full border-r border-black/20 text-[#dbdee1] shrink-0 hidden md:flex">
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between shadow-sm hover:bg-[#35373c] transition-colors cursor-pointer border-b border-[#111214]">
        <h1 className="font-bold text-[15px] truncate">CS402 Socket Project</h1>
        <ChevronDown className="w-4 h-4 ml-2" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Quick Actions / Search */}
        <button className="w-full text-left px-2 py-1.5 rounded-sm bg-[#111214] text-[#949ba4] text-sm flex items-center gap-2 hover:text-[#dbdee1] transition-colors">
          <Search className="w-3 h-3" />
          <span>Find or start a conversation</span>
        </button>

        {/* Text Channels */}
        <div>
          <div 
            className="flex items-center justify-between px-0.5 mb-1 text-xs font-bold text-[#949ba4] hover:text-[#dbdee1] cursor-pointer uppercase tracking-wide"
            onClick={() => toggleCategory('text')}
          >
            <div className="flex items-center gap-0.5">
              <ChevronDown className={`w-3 h-3 transition-transform ${collapsedCategories['text'] ? '-rotate-90' : ''}`} />
              <span>Text Channels</span>
            </div>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          </div>
          
          <AnimatePresence>
            {!collapsedCategories['text'] && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-[2px]"
              >
                {channels.filter(c => c.type === 'text').map(channel => (
                  <div
                    key={channel.id}
                    onClick={() => onChannelSelect(channel)}
                    className={`group px-2 py-[5px] mx-0.5 rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                      activeChannel.id === channel.id 
                        ? 'bg-[#404249] text-white' 
                        : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                    }`}
                  >
                    <Hash className="w-4 h-4 text-[#80848e]" />
                    <span className="font-medium text-[15px] truncate">{channel.name}</span>
                    {channel.unread && channel.unread > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                        {channel.unread}
                      </span>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="flex items-center justify-between px-0.5 mb-1 text-xs font-bold text-[#949ba4] uppercase tracking-wide">
            <span>Direct Messages</span>
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-[2px]">
            {users.map(user => (
              <div 
                key={user.id}
                className={`group px-2 py-[5px] mx-0.5 rounded-md flex items-center gap-3 cursor-pointer transition-all ${
                  currentUser?.id === user.id ? 'opacity-50 cursor-default' : 'hover:bg-[#35373c] hover:text-[#dbdee1]'
                }`}
              >
                <div className="relative">
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(user.username)} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      user.username.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2.5px] border-[#1e1f22] ${
                    user.status === 'online' ? 'bg-green-500' : 
                    user.status === 'away' ? 'bg-yellow-500' : 
                    user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[15px] font-medium truncate ${
                    user.status === 'offline' ? 'text-[#80848e]' : 'text-[#dbdee1]'
                  }`}>
                    {user.username}
                  </span>
                  {currentUser?.id === user.id && (
                    <span className="ml-2 text-[10px] bg-[#2b2d31] px-1 rounded text-[#949ba4]">You</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Status Footer */}
      {currentUser && (
        <div className="bg-[#232428] px-2 py-1.5 flex items-center gap-2 mt-auto">
          <div className="relative cursor-pointer group hover:opacity-80 transition-opacity" onClick={onOpenSettings}>
            <div className={`w-8 h-8 rounded-full ${getAvatarColor(currentUser.username)} flex items-center justify-center text-white text-xs font-bold`}>
              {currentUser.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[2.5px] border-[#232428]"></div>
          </div>
          
          <div className="flex-1 min-w-0 mr-1 cursor-pointer" onClick={onOpenSettings}>
            <div className="text-sm font-semibold text-white truncate leading-tight hover:underline">
              {currentUser.username}
            </div>
            <div className="text-xs text-[#b5bac1] truncate">
              #{currentUser.id.substring(0, 4)}
            </div>
          </div>

          <div className="flex items-center">
            <button 
              className="p-1.5 hover:bg-[#3f4147] rounded-[4px] group relative"
              onClick={() => setMicMuted(!isMicMuted)}
            >
              {isMicMuted ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                 <Mic className="w-4 h-4 text-[#dbdee1]" />
              )}
            </button>
            <button 
              className="p-1.5 hover:bg-[#3f4147] rounded-[4px]"
              onClick={() => setDeafened(!isDeafened)}
            >
              {isDeafened ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Headphones className="w-4 h-4 text-[#dbdee1]" />
              )}
            </button>
            <button 
              className="p-1.5 hover:bg-[#3f4147] rounded-[4px]"
              onClick={onOpenSettings}
            >
              <Settings className="w-4 h-4 text-[#dbdee1]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
