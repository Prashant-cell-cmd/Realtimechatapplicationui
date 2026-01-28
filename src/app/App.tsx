import React, { useState, useEffect, useCallback } from 'react';
import { User, Message } from './types';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { nanoid } from 'nanoid';

// Mock data
const MOCK_USERS: User[] = [
  { id: 'u1', username: 'alex_dev', status: 'online' },
  { id: 'u2', username: 'sarah_cpp', status: 'away' },
  { id: 'u3', username: 'prof_miller', status: 'online' },
  { id: 'u4', username: 'web_client_2', status: 'offline' },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    text: 'Welcome to the Chat System prototype!',
    senderId: 'system',
    senderName: 'System',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isSystem: true,
  },
  {
    id: 'm2',
    text: 'Has anyone tested the new socket implementation?',
    senderId: 'u1',
    senderName: 'alex_dev',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'm3',
    text: 'Yes, the latency is much better now.',
    senderId: 'u3',
    senderName: 'prof_miller',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
];

export default function App() {
  const [view, setView] = useState<'login' | 'chat'>('login');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  // Simulated backend responses
  const simulateIncomingMessage = useCallback(() => {
    const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    if (randomUser.status === 'offline') return;

    const phrases = [
      "I agree with that assessment.",
      "The C++ backend is stable.",
      "Are we ready for the presentation?",
      "Checking the logs now...",
      "Packet received successfully.",
      "Make sure to handle the disconnect event.",
      "Latency is under 20ms.",
      "Looks good to me!",
    ];

    const randomText = phrases[Math.floor(Math.random() * phrases.length)];

    const newMessage: Message = {
      id: nanoid(),
      text: randomText,
      senderId: randomUser.id,
      senderName: randomUser.username,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Setup simulation effect
  useEffect(() => {
    if (view !== 'chat') return;

    // Simulate random incoming messages every 10-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateIncomingMessage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [view, simulateIncomingMessage]);

  const handleJoin = async (username: string) => {
    setIsConnecting(true);

    // Simulate network delay
    setTimeout(() => {
      const newUser: User = {
        id: nanoid(),
        username,
        status: 'online',
      };

      setCurrentUser(newUser);
      setUsers(prev => [...prev, newUser]);
      setIsConnecting(false);
      setView('chat');

      // Add system message
      setMessages(prev => [
        ...prev,
        {
          id: nanoid(),
          text: `Connected to server (127.0.0.1:8080)`,
          senderId: 'system',
          senderName: 'System',
          timestamp: new Date(),
          isSystem: true,
        },
        {
          id: nanoid(),
          text: `${username} joined the chat`,
          senderId: 'system',
          senderName: 'System',
          timestamp: new Date(),
          isSystem: true,
        },
      ]);
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

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="font-sans text-slate-900 h-screen w-full overflow-hidden bg-slate-50">
      {view === 'login' ? (
        <LoginScreen onJoin={handleJoin} isConnecting={isConnecting} />
      ) : (
        <div className="flex h-full shadow-2xl overflow-hidden max-w-[1920px] mx-auto bg-white">
          <Sidebar users={users} currentUser={currentUser} />
          <ChatWindow 
            messages={messages} 
            currentUser={currentUser} 
            onSendMessage={handleSendMessage}
            onlineCount={users.filter(u => u.status !== 'offline').length}
          />
        </div>
      )}
    </div>
  );
}
