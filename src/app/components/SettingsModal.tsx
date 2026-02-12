import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Server, Shield, Cpu, Activity, Globe, Wifi } from 'lucide-react';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export function SettingsModal({ isOpen, onClose, currentUser }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-2xl bg-[#313338] rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex">
            {/* Sidebar */}
            <div className="w-1/3 bg-[#2b2d31] p-4 flex flex-col gap-1">
              <div className="px-2 mb-2 text-xs font-bold text-[#949ba4] uppercase">User Settings</div>
              <button className="text-left px-2 py-1.5 rounded bg-[#404249] text-white text-sm font-medium">My Account</button>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Profiles</button>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Privacy & Safety</button>
              
              <div className="px-2 mt-4 mb-2 text-xs font-bold text-[#949ba4] uppercase">App Settings</div>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Appearance</button>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Voice & Video</button>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Keybinds</button>
              
              <div className="px-2 mt-4 mb-2 text-xs font-bold text-[#949ba4] uppercase">Socket Config</div>
              <button className="text-left px-2 py-1.5 rounded hover:bg-[#35373c] text-[#b5bac1] hover:text-[#dbdee1] text-sm font-medium transition-colors">Network Stats</button>
              
              <div className="mt-auto pt-4 border-t border-[#3f4147]">
                 <button className="text-left px-2 py-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-500 text-sm font-medium transition-colors w-full flex items-center gap-2">
                   Log Out
                 </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 bg-[#313338] overflow-y-auto relative">
              <h2 className="text-xl font-bold text-white mb-6">My Account</h2>
              
              {/* Profile Card */}
              <div className="bg-[#1e1f22] rounded-lg overflow-hidden mb-8">
                <div className="h-24 bg-[#5865f2]" />
                <div className="px-4 pb-4 relative">
                  <div className="absolute -top-10 left-4 w-20 h-20 rounded-full bg-[#1e1f22] p-1.5">
                    <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                       {currentUser?.username.slice(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-[#1e1f22]"></div>
                  </div>
                  
                  <div className="flex justify-end pt-3">
                    <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors">
                      Edit User Profile
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <h3 className="text-lg font-bold text-white">{currentUser?.username}</h3>
                    <p className="text-xs text-[#b5bac1]">#{currentUser?.id.slice(0, 4)}</p>
                  </div>
                  
                  <div className="mt-6 bg-[#2b2d31] rounded-lg p-3 space-y-3">
                    <div className="flex justify-between items-center">
                       <div>
                         <label className="text-[10px] font-bold text-[#b5bac1] uppercase">Display Name</label>
                         <p className="text-sm text-white">{currentUser?.username}</p>
                       </div>
                       <button className="bg-[#3f4147] hover:bg-[#4e5058] text-white text-xs px-3 py-1.5 rounded transition-colors">Edit</button>
                    </div>
                    <div className="flex justify-between items-center">
                       <div>
                         <label className="text-[10px] font-bold text-[#b5bac1] uppercase">Email</label>
                         <p className="text-sm text-white">*******@university.edu</p>
                       </div>
                       <button className="bg-[#3f4147] hover:bg-[#4e5058] text-white text-xs px-3 py-1.5 rounded transition-colors">Edit</button>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-4">Socket Connection Details</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#2b2d31] p-4 rounded-lg border border-[#1e1f22]">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-[#b5bac1] uppercase">Server IP</span>
                    </div>
                    <p className="text-white font-mono text-sm">192.168.1.42</p>
                 </div>
                 <div className="bg-[#2b2d31] p-4 rounded-lg border border-[#1e1f22]">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-[#b5bac1] uppercase">Port</span>
                    </div>
                    <p className="text-white font-mono text-sm">8080</p>
                 </div>
                 <div className="bg-[#2b2d31] p-4 rounded-lg border border-[#1e1f22]">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-bold text-[#b5bac1] uppercase">Latency</span>
                    </div>
                    <p className="text-white font-mono text-sm">12ms</p>
                 </div>
                 <div className="bg-[#2b2d31] p-4 rounded-lg border border-[#1e1f22]">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-[#b5bac1] uppercase">Encryption</span>
                    </div>
                    <p className="text-white font-mono text-sm">TLS v1.3</p>
                 </div>
              </div>

              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#404249] text-[#b5bac1] hover:text-white transition-colors border border-[#b5bac1]/20 flex flex-col items-center justify-center gap-0.5"
              >
                <X className="w-6 h-6" />
                <span className="text-[10px] font-bold">ESC</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
