export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

// ============================================================
// src/types/chat.types.ts
// ============================================================

export interface ChatUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  lastSeenAt?: string | null;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  isEdited: boolean;
  editedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  sender: ChatUser;
  toUserId?: string; // present on dm:message socket events
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPrivate: boolean;
  isDirect?: boolean;
  memberCount: number;
  isMember: boolean;
  myRole: 'OWNER' | 'ADMIN' | 'MEMBER' | null;
  createdAt: string;
}

export interface DMConversation {
  peer: ChatUser;
  roomId: string | null;
  lastMessage: string;
  lastTime: string | null;
  unread: number;
}

export type ActiveView = 'messages' | 'rooms' | 'dashboard' | 'schedule' | 'activity';