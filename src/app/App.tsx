import React, { useState, useEffect, useCallback } from 'react';
import { User, Message, Channel } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { MemberList } from './components/MemberList';
import { SettingsModal } from './components/SettingsModal';
import { nanoid } from 'nanoid';
import { Toaster, toast } from 'sonner';

// Mock data
const MOCK_USERS: User[] = [
  { id: 'u1', username: 'alex_dev', status: 'online', role: 'user' },
  { id: 'u2', username: 'sarah_cpp', status: 'away', role: 'user' },
  { id: 'u3', username: 'prof_miller', status: 'online', role: 'admin' },
  { id: 'u4', username: 'web_client_2', status: 'offline', role: 'user' },
  { id: 'u5', username: 'tester_01', status: 'busy', role: 'user' },
];

const MOCK_CHANNELS: Channel[] = [
  { id: 'c1', name: 'general', type: 'text', description: 'General discussion about socket programming.' },
  { id: 'c2', name: 'announcements', type: 'text', description: 'Important course updates.' },
  { id: 'c3', name: 'debug-help', type: 'text', description: 'Paste your stack traces here.' },
  { id: 'c4', name: 'resources', type: 'text', description: 'Links to helpful tutorials.' },
  { id: 'v1', name: 'Voice - General', type: 'voice' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c1': [
    {
      id: 'm1',
      text: 'Welcome to the #general channel!',
      senderId: 'system',
      senderName: 'System',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isSystem: true,
    },
    {
      id: 'm2',
      text: 'Here is the basic socket structure we need to implement:\n```\nstruct Packet {\n    int type;\n    int length;\n    char payload[1024];\n};\n```',
      senderId: 'u3',
      senderName: 'prof_miller',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'm3',
      text: 'Thanks Professor! Does the `payload` size need to be fixed?',
      senderId: 'u1',
      senderName: 'alex_dev',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
  ],
  'c2': [
    {
      id: 'm4',
      text: 'Final submission deadline is extended by 24 hours.',
      senderId: 'u3',
      senderName: 'prof_miller',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    }
  ]
};

export default function App() {
  const [view, setView] = useState<'login' | 'chat'>('login');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeChannel, setActiveChannel] = useState<Channel>(MOCK_CHANNELS[0]);
  
  // UI State
  const [showMemberList, setShowMemberList] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Store messages per channel
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  
  const [isTyping, setIsTyping] = useState(false);

  // Helper to get current messages
  const currentMessages = messages[activeChannel.id] || [];

  // Simulated backend responses
  const simulateIncomingMessage = useCallback(() => {
    // Only simulate for #general
    if (activeChannel.id !== 'c1') return;

    if (Math.random() > 0.6) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addRandomMessage();
      }, 3000);
    }
  }, [activeChannel]);

  const addRandomMessage = () => {
    const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    if (randomUser.status === 'offline') return;

    const phrases = [
      "I think we need to use `setsockopt` for reuse address.",
      "Is anyone else getting a bind error?",
      "Check if the port is already in use.",
      "The handshake works now!",
      "I pushed the updated `server.cpp` to the repo.",
      "Can we use `select()` for non-blocking I/O?",
      "Make sure to handle the `SIGPIPE` signal.",
    ];

    const randomText = phrases[Math.floor(Math.random() * phrases.length)];

    const newMessage: Message = {
      id: nanoid(),
      text: randomText,
      senderId: randomUser.id,
      senderName: randomUser.username,
      timestamp: new Date(),
    };

    addMessageToChannel('c1', newMessage);
  };

  const addMessageToChannel = (channelId: string, message: Message) => {
    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), message]
    }));
  };

  // Setup simulation effect
  useEffect(() => {
    if (view !== 'chat') return;

    const interval = setInterval(() => {
      simulateIncomingMessage();
    }, 12000);

    return () => clearInterval(interval);
  }, [view, simulateIncomingMessage]);

  const handleJoin = async (username: string) => {
    setIsConnecting(true);

    setTimeout(() => {
      const newUser: User = {
        id: nanoid(),
        username,
        status: 'online',
        role: 'user'
      };

      setCurrentUser(newUser);
      setUsers(prev => [newUser, ...prev]);
      setIsConnecting(false);
      setView('chat');

      toast.success('Connected to Socket Server', {
        description: 'Secure connection established on port 8080',
        className: 'bg-[#1e1f22] text-white border-gray-700'
      });
    }, 1500);
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: nanoid(),
      text,
      senderId: currentUser.id,
      senderName: currentUser.username,
      timestamp: new Date(),
    };

    addMessageToChannel(activeChannel.id, newMessage);
  };

  return (
    <div className="font-sans text-[#dbdee1] h-screen w-full overflow-hidden bg-[#313338]">
      <Toaster position="bottom-right" theme="dark" />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        currentUser={currentUser}
      />
      
      {view === 'login' ? (
        <LoginScreen onJoin={handleJoin} isConnecting={isConnecting} />
      ) : (
        <div className="flex h-full overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar 
            users={users} 
            currentUser={currentUser} 
            activeChannel={activeChannel}
            channels={MOCK_CHANNELS}
            onChannelSelect={setActiveChannel}
            onOpenSettings={() => setShowSettings(true)}
          />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className="flex flex-1 overflow-hidden">
               <div className="flex-1 flex flex-col min-w-0">
                  <ChatWindow 
                    messages={currentMessages} 
                    currentUser={currentUser} 
                    activeChannel={activeChannel}
                    onSendMessage={handleSendMessage}
                    onlineCount={users.filter(u => u.status !== 'offline').length}
                    isTyping={isTyping}
                  />
               </div>
               
               {/* Right Sidebar (Member List) */}
               {showMemberList && (
                 <MemberList users={users} onlineCount={users.filter(u => u.status !== 'offline').length} />
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
