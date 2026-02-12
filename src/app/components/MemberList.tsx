import React from 'react';
import { User } from '../types';
import { Shield, Crown, Circle } from 'lucide-react';

interface MemberListProps {
  users: User[];
  onlineCount: number;
}

export function MemberList({ users, onlineCount }: MemberListProps) {
  // Group users by status or role
  const onlineUsers = users.filter(u => u.status !== 'offline');
  const offlineUsers = users.filter(u => u.status === 'offline');

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const renderUserGroup = (title: string, groupUsers: User[]) => {
    if (groupUsers.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="px-4 text-xs font-bold text-[#949ba4] uppercase tracking-wide mb-2">
          {title} — {groupUsers.length}
        </h3>
        <div className="space-y-[2px]">
          {groupUsers.map(user => (
            <div 
              key={user.id} 
              className="flex items-center gap-3 px-2 py-1.5 mx-2 rounded hover:bg-[#35373c] cursor-pointer group transition-colors opacity-90 hover:opacity-100"
            >
              <div className="relative">
                <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.username)} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                  ) : (
                    user.username.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#2b2d31] ${
                  user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 
                  user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-medium text-sm truncate ${user.status === 'offline' ? 'text-[#80848e]' : 'text-[#dbdee1] group-hover:text-white'}`}>
                    {user.username}
                  </span>
                  {user.role === 'admin' && (
                    <Crown className="w-3 h-3 text-[#e6c02a]" fill="#e6c02a" />
                  )}
                </div>
                {user.status !== 'offline' && user.status !== 'online' && (
                  <p className="text-[10px] text-[#949ba4] truncate">
                     {user.status === 'away' ? 'Idle for 5m' : 'Do Not Disturb'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[240px] bg-[#2b2d31] flex flex-col h-full border-l border-[#1e1f22] hidden lg:flex">
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        {renderUserGroup('Online', onlineUsers)}
        {renderUserGroup('Offline', offlineUsers)}
      </div>
    </div>
  );
}
