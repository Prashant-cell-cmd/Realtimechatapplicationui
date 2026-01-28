import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Server, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Socket Chat</h1>
          <p className="text-indigo-100 text-sm">C++ Client-Server Prototype</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Choose a Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800"
                placeholder="Ex: student_01"
                disabled={isConnecting}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || isConnecting}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-white font-medium transition-all ${
                !username.trim() || isConnecting 
                  ? 'bg-indigo-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {isConnecting ? (
                <>
                  <Server className="w-5 h-5 animate-pulse" />
                  <span>Connecting to Server...</span>
                </>
              ) : (
                <>
                  <span>Connect</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-start space-x-3 text-xs text-slate-500">
              <div className="bg-slate-100 p-2 rounded-full shrink-0">
                <Server className="w-4 h-4 text-slate-600" />
              </div>
              <p>
                This client connects to the local C++ socket server. Ensure the backend is running on port 8080 before connecting.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
