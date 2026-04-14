"use client";

// ============================================================
// src/context/ChatContext.tsx
// ============================================================
'use client';

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  createContext,
} from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatUser, Message, DMConversation, Room } from '@/types/types';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatContextValue {
  // Connection state
  connected: boolean;

  // Current user (from main app auth)
  myUser: ChatUser | null;

  // Presence
  onlineUserIds: Set<string>;

  // DM conversations map: peerId → DMConversation
  dmConversations: Map<string, DMConversation>;

  // Active DM peer
  activePeer: ChatUser | null;
  setActivePeer: (peer: ChatUser | null) => void;

  // Messages for active DM
  activeMessages: Message[];
  messagesLoading: boolean;

  // Rooms
  rooms: Room[];
  roomsLoading: boolean;
  loadRooms: () => Promise<void>;

  // Actions
  sendDM: (toUserId: string, content: string) => void;
  sendTypingStart: (toUserId: string) => void;
  sendTypingStop: (toUserId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  joinRoom: (roomId: string) => Promise<void>;
  createRoom: (name: string, description?: string, isPrivate?: boolean) => Promise<Room>;
  searchUsers: (query: string) => Promise<ChatUser[]>;
  markRead: (roomId: string) => void;

  // Typing peers: peerId → username
  typingPeers: Map<string, string>;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside <ChatProvider>');
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────────

interface ChatProviderProps {
  children: ReactNode;
  /** Access token from the main app's auth system */
  accessToken: string;
  /** Base URL of the chat service backend (default: http://localhost:3001) */
  chatServiceUrl?: string;
  /** Current logged-in user from main app */
  currentUser: { userId: number; email: string; fullName?: string };
}

export function ChatProvider({
  children,
  accessToken,
  chatServiceUrl = 'http://localhost:3001',
  currentUser,
}: ChatProviderProps) {
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [myUser, setMyUser] = useState<ChatUser | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [dmConversations, setDmConversations] = useState<Map<string, DMConversation>>(new Map());
  const [activePeer, setActivePeerState] = useState<ChatUser | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [typingPeers, setTypingPeers] = useState<Map<string, string>>(new Map());

  // Keep activePeer in a ref so socket handlers always have the latest value
  const activePeerRef = useRef<ChatUser | null>(null);

  // ── REST helper ──────────────────────────────────────────────────────────────

  const apiFetch = useCallback(
    async <T = unknown>(path: string, opts: RequestInit = {}): Promise<T> => {
      const res = await fetch(`${chatServiceUrl}${path}`, {
        ...opts,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(opts.headers ?? {}),
        },
        body: opts.body,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? `HTTP ${res.status}`);
      }
      return res.json() as Promise<T>;
    },
    [accessToken, chatServiceUrl]
  );

  // ── Upsert DM conversation entry ──────────────────────────────────────────────

  const upsertDMConvo = useCallback(
    (peer: ChatUser, patch: Partial<Omit<DMConversation, 'peer'>>) => {
      setDmConversations((prev) => {
        const next = new Map(prev);
        const existing = next.get(peer.id) ?? {
          peer,
          roomId: null,
          lastMessage: '',
          lastTime: null,
          unread: 0,
        };
        next.set(peer.id, { ...existing, peer, ...patch });
        return next;
      });
    },
    []
  );

  // ── Load my user profile and DMs from chat service ──────────────────────────

  useEffect(() => {
    // Load my user profile
    apiFetch<ChatUser>('/users/me')
      .then((u) => setMyUser(u))
      .catch(console.warn);

    // Load DM conversations history
    apiFetch<DMConversation[]>('/rooms/dms')
      .then((dms) => {
        setDmConversations((prev) => {
          const next = new Map(prev);
          for (const dm of dms) {
            if (!next.has(dm.peer.id)) {
              next.set(dm.peer.id, dm);
            }
          }
          return next;
        });
      })
      .catch((e) => console.warn('Failed to load DMs:', e));
  }, [apiFetch]);

  // ── Socket setup ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const socket = io(chatServiceUrl, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (e) => console.warn('[chat-ws]', e.message));

    // Presence
    socket.on('users:online', (ids: string[]) =>
      setOnlineUserIds(new Set(ids))
    );
    socket.on('user:online', ({ userId }: { userId: string }) =>
      setOnlineUserIds((prev) => new Set([...prev, userId]))
    );
    socket.on('user:offline', ({ userId }: { userId: string }) =>
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      })
    );

    socket.on('dm:message', (msg: Message) => {
      const myId = String(currentUser.userId);
      const senderStr = String(msg.senderId);
      const toStr = msg.toUserId ? String(msg.toUserId) : '';
      const peerId = senderStr === myId ? toStr : senderStr;

      // If this is the active conversation, append to messages
      if (String(activePeerRef.current?.id) === peerId) {
        setActiveMessages((prev) => {
          if (prev.some((m) => String(m.id) === String(msg.id))) return prev;
          return [...prev, msg];
        });
        // Mark read
        if (msg.roomId) socket.emit('room:mark_read', { roomId: msg.roomId });
      }

      // Update conversation list
      setDmConversations((prev) => {
        const next = new Map(prev);
        const existing = next.get(peerId);
        const isActive = String(activePeerRef.current?.id) === peerId;
        next.set(peerId, {
          peer: existing?.peer ?? msg.sender,
          roomId: msg.roomId ?? existing?.roomId ?? null,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unread: isActive ? 0 : (existing?.unread ?? 0) + 1,
        });
        return next;
      });
    });

    // Typing
    socket.on(
      'typing:start',
      ({ fromUserId, fromUsername }: { fromUserId: string; fromUsername: string }) => {
        setTypingPeers((prev) => new Map(prev).set(fromUserId, fromUsername));
      }
    );
    socket.on('typing:stop', ({ fromUserId }: { fromUserId: string }) => {
      setTypingPeers((prev) => {
        const next = new Map(prev);
        next.delete(fromUserId);
        return next;
      });
    });

    // Message edits / deletes
    socket.on('message:edited', (updated: Message) => {
      setActiveMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    });
    socket.on(
      'message:deleted',
      ({ messageId }: { messageId: string }) => {
        setActiveMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, isDeleted: true, content: '' }
              : m
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, chatServiceUrl]);

  // ── setActivePeer — load history when switching conversations ─────────────────

  const setActivePeer = useCallback(
    async (peer: ChatUser | null) => {
      activePeerRef.current = peer;
      setActivePeerState(peer);
      setActiveMessages([]);

      if (!peer) return;

      // Clear unread for this peer
      setDmConversations((prev) => {
        const next = new Map(prev);
        const existing = next.get(peer.id);
        if (existing) next.set(peer.id, { ...existing, unread: 0 });
        return next;
      });

      // Fetch message history if we have a roomId
      const convo = dmConversations.get(peer.id);
      if (convo?.roomId) {
        setMessagesLoading(true);
        try {
          const msgs = await apiFetch<Message[]>(
            `/rooms/${convo.roomId}/messages?limit=50`
          );
          setActiveMessages(msgs);
          socketRef.current?.emit('room:mark_read', { roomId: convo.roomId });
        } catch (e) {
          console.warn('loadHistory', e);
        } finally {
          setMessagesLoading(false);
        }
      }
    },
    [apiFetch, dmConversations]
  );

  // ── Actions ───────────────────────────────────────────────────────────────────

  const sendDM = useCallback((toUserId: string, content: string) => {
    socketRef.current?.emit(
      'dm:send',
      { toUserId, content },
      (res: { ok?: boolean; error?: string; message?: Message }) => {
        if (res?.message?.roomId) {
          // Store roomId so we can load history next time
          upsertDMConvo(activePeerRef.current!, { roomId: res.message.roomId });
        }
        if (res?.error) console.error('dm:send error', res.error);
      }
    );
  }, [upsertDMConvo]);

  const sendTypingStart = useCallback((toUserId: string) => {
    socketRef.current?.emit('typing:start', { toUserId });
  }, []);

  const sendTypingStop = useCallback((toUserId: string) => {
    socketRef.current?.emit('typing:stop', { toUserId });
  }, []);

  const editMessage = useCallback((messageId: string, content: string) => {
    socketRef.current?.emit('message:edit', { messageId, content });
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    socketRef.current?.emit('message:delete', { messageId });
  }, []);

  const markRead = useCallback((roomId: string) => {
    socketRef.current?.emit('room:mark_read', { roomId });
  }, []);

  const joinRoom = useCallback(
    async (roomId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        socketRef.current?.emit(
          'room:join',
          { roomId },
          (res: { ok?: boolean; error?: string }) => {
            if (res?.ok) resolve();
            else reject(new Error(res?.error ?? 'Join failed'));
          }
        );
      });
    },
    []
  );

  const createRoom = useCallback(
    async (name: string, description?: string, isPrivate?: boolean): Promise<Room> => {
      const room = await apiFetch<Room>('/rooms', {
        method: 'POST',
        body: JSON.stringify({ name, description, isPrivate }),
      });
      return room;
    },
    [apiFetch]
  );

  const loadRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      const data = await apiFetch<Room[]>('/rooms');
      setRooms(data);
    } catch (e) {
      console.warn('loadRooms', e);
    } finally {
      setRoomsLoading(false);
    }
  }, [apiFetch]);

  const searchUsers = useCallback(
    async (query: string): Promise<ChatUser[]> => {
      if (query.length < 2) return [];
      return apiFetch<ChatUser[]>(`/users/search?q=${encodeURIComponent(query)}`);
    },
    [apiFetch]
  );

  // ── Context value ─────────────────────────────────────────────────────────────

  const value: ChatContextValue = {
    connected,
    myUser,
    onlineUserIds,
    dmConversations,
    activePeer,
    setActivePeer,
    activeMessages,
    messagesLoading,
    rooms,
    roomsLoading,
    loadRooms,
    sendDM,
    sendTypingStart,
    sendTypingStop,
    editMessage,
    deleteMessage,
    joinRoom,
    createRoom,
    searchUsers,
    markRead,
    typingPeers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}