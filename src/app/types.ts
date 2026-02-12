export interface User {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  avatar?: string;
  role?: 'admin' | 'user';
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  description?: string;
  unread?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isSystem?: boolean;
  reactions?: Reaction[];
  attachment?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
    size?: string;
  };
}
