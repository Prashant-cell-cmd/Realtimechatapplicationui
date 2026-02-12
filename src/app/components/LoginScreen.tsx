import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Server, ArrowRight, Activity, ShieldCheck, Globe } from 'lucide-react';

interface LoginScreenProps {
  onJoin: (username: string) => void;
  isConnecting: boolean;
}

export function LoginScreen({ onJoin, isConnecting }: LoginScreenProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#111214]">
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{ 
          backgroundImage: 'linear-gradient(#2b2d31 1px, transparent 1px), linear-gradient(90deg, #2b2d31 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#1e1f22] border border-[#2b2d31] rounded-lg shadow-2xl overflow-hidden z-10 mx-4"
      >
        <div className="p-8 pb-6 text-center border-b border-[#2b2d31]">
          <div className="mx-auto w-16 h-16 bg-[#5865f2] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back!</h1>
          <p className="text-[#b5bac1] text-sm">We're so excited to see you again!</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-bold text-[#b5bac1] uppercase tracking-wide">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-[#111214] border border-transparent rounded-[3px] text-white placeholder-[#5e636e] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                placeholder="Enter your username"
                disabled={isConnecting}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || isConnecting}
              className={`w-full py-3 px-4 rounded-[3px] flex items-center justify-center space-x-2 text-white font-medium text-sm transition-all ${
                !username.trim() || isConnecting 
                  ? 'bg-[#5865f2] opacity-50 cursor-not-allowed' 
                  : 'bg-[#5865f2] hover:bg-[#4752c4] active:scale-[0.98]'
              }`}
            >
              {isConnecting ? (
                <>
                  <Server className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-[#949ba4]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Systems Operational</span>
            </div>
            <span>v2.1.0 (Stable)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
