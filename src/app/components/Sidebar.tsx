import React from 'react';
import { User } from '../types';
import { Circle, Search, Users } from 'lucide-react';

interface SidebarProps {
  users: User[];
  currentUser: User | null;
}

export function Sidebar({ users, currentUser }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full hidden md:flex">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Online Users
        </h2>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              currentUser?.id === user.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-200/50'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-sm">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.username} {currentUser?.id === user.id && '(You)'}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {user.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-100/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Server Status: Stable
        </div>
      </div>
    </div>
  );
}
