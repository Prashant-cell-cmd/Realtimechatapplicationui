export interface User {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isSystem?: boolean;
}
