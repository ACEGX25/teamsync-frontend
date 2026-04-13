"use client";

// ============================================================
// src/components/chat/ChatArea.tsx
// ============================================================

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  KeyboardEvent,
} from 'react';
import { useChatContext } from '@/context/ChatContext';
import { MessageBubble } from '@/components/chat/MessageBubble';
import type { Message } from '@/types/types';

function DateDivider({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
      <span
        style={{
          fontSize: '11px', color: '#9090b0',
          background: '#f0eef8', padding: '4px 14px',
          borderRadius: '20px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

export function ChatArea() {
  const {
    activePeer,
    activeMessages,
    messagesLoading,
    myUser,
    onlineUserIds,
    typingPeers,
    sendDM,
    sendTypingStart,
    sendTypingStop,
  } = useChatContext();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Reset input when peer changes
  useEffect(() => {
    setInputValue('');
    setIsTyping(false);
    textareaRef.current?.focus();
  }, [activePeer?.id]);

  // ── Send ───────────────────────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const content = inputValue.trim();
    if (!content || !activePeer) return;
    sendDM(activePeer.id, content);
    setInputValue('');
    stopTypingIndicator();
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue, activePeer, sendDM]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Typing indicator ───────────────────────────────────────────────────────

  const stopTypingIndicator = useCallback(() => {
    if (isTyping && activePeer) {
      setIsTyping(false);
      sendTypingStop(activePeer.id);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  }, [isTyping, activePeer, sendTypingStop]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';

    // Typing indicator
    if (!activePeer) return;
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStart(activePeer.id);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTypingIndicator, 2000);
  };

  // ── Render messages with date dividers ─────────────────────────────────────

  const renderMessages = () => {
    const items: React.ReactNode[] = [];
    let lastDate = '';

    activeMessages.forEach((msg, idx) => {
      const dateLabel = formatDateLabel(msg.createdAt);
      if (dateLabel !== lastDate) {
        items.push(<DateDivider key={`date-${msg.createdAt}`} label={dateLabel} />);
        lastDate = dateLabel;
      }

      const isMine = msg.senderId === myUser?.id;
      const nextMsg = activeMessages[idx + 1];
      // Show avatar on last consecutive message from same sender
      const showAvatar = !isMine && (!nextMsg || nextMsg.senderId !== msg.senderId);

      items.push(
        <MessageBubble
          key={msg.id}
          message={msg}
          isMine={isMine}
          showAvatar={showAvatar}
        />
      );
    });

    return items;
  };

  // ── Typing peers for active conversation ──────────────────────────────────

  const peerTyping = activePeer ? typingPeers.get(activePeer.id) : undefined;
  const isOnline = activePeer ? onlineUserIds.has(activePeer.id) : false;

  // ── Empty state ────────────────────────────────────────────────────────────

  if (!activePeer) {
    return (
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#fafafa', gap: '12px',
        }}
      >
        <div style={{ opacity: 0.25 }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="#7c5cbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '15px', fontWeight: 600, color: '#c0bed8', margin: 0 }}>
          Select a conversation
        </p>
        <p style={{ fontSize: '13px', color: '#c0bed8', margin: 0 }}>
          Choose a DM or start a new one
        </p>
      </div>
    );
  }

  const peerInitials = (activePeer.displayName || activePeer.username || '?').charAt(0).toUpperCase();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fafafa' }}>

      {/* ── Header ── */}
      <div
        style={{
          padding: '14px 24px', borderBottom: '1px solid #ece9f8',
          background: '#ffffff', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '15px', fontWeight: 600, overflow: 'hidden',
              }}
            >
              {activePeer.avatarUrl
                ? <img src={activePeer.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : peerInitials}
            </div>
            {isOnline && (
              <span
                style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#10b981', border: '2px solid #fff',
                }}
              />
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>
              {activePeer.displayName || activePeer.username}
            </div>
            <div style={{ fontSize: '12px', color: isOnline ? '#10b981' : '#9090b0' }}>
              {isOnline ? 'Online now' : 'Offline'}
            </div>
          </div>
        </div>

        {/* Header actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            <VideoIcon />, <PhoneIcon />, <InfoIcon />
          ].map((icon, i) => (
            <HeaderBtn key={i}>{icon}</HeaderBtn>
          ))}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '1px',
        }}
      >
        {messagesLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#9090b0', fontSize: '13px' }}>
            Loading messages…
          </div>
        )}

        {!messagesLoading && activeMessages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ opacity: 0.3 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="#7c5cbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: '13px', color: '#c0bed8', margin: 0 }}>
              Say hello to {activePeer.displayName || activePeer.username}!
            </p>
          </div>
        )}

        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Typing indicator ── */}
      {peerTyping && (
        <div
          style={{
            padding: '4px 24px 6px',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '12px', color: '#9090b0',
          }}
        >
          <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {[0, 0.18, 0.36].map((delay, i) => (
              <span
                key={i}
                style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#b8a8e0', display: 'inline-block',
                  animation: `bounce 1.2s infinite ${delay}s`,
                }}
              />
            ))}
          </span>
          <span>{peerTyping} is typing…</span>
        </div>
      )}

      {/* ── Input area ── */}
      <div
        style={{
          padding: '10px 18px 14px', background: '#ffffff',
          borderTop: '1px solid #ece9f8', flexShrink: 0,
        }}
      >
        <div
          ref={inputWrapperRef}
          style={{
            display: 'flex', alignItems: 'flex-end', gap: '8px',
            background: '#fafafa', border: '1.5px solid #e2e0f0',
            borderRadius: '16px', padding: '8px 10px',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={() => { if (inputWrapperRef.current) inputWrapperRef.current.style.borderColor = '#b8a8e0'; }}
          onBlur={() => { if (inputWrapperRef.current) inputWrapperRef.current.style.borderColor = '#e2e0f0'; }}
        >
          {/* Attachment button */}
          <IconBtn title="Attach file">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </IconBtn>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
              resize: 'none', outline: 'none', lineHeight: 1.5,
              maxHeight: '120px', overflowY: 'auto',
              padding: '2px 0',
            }}
          />

          {/* Emoji button */}
          <IconBtn title="Emoji">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </IconBtn>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={{
              width: '34px', height: '34px', flexShrink: 0,
              background: inputValue.trim() ? '#7c5cbf' : '#e2e0f0',
              border: 'none', borderRadius: '10px', cursor: inputValue.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: inputValue.trim() ? '0 2px 8px rgba(124,92,191,0.28)' : 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { if (inputValue.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#6241a8'; }}
            onMouseLeave={(e) => { if (inputValue.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <line x1="22" y1="2" x2="11" y2="13" stroke={inputValue.trim() ? '#fff' : '#9090b0'} strokeWidth="2.2" strokeLinecap="round" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke={inputValue.trim() ? '#fff' : '#9090b0'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small shared components ────────────────────────────────────────────────────

function HeaderBtn({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <button
      style={{
        width: '36px', height: '36px', borderRadius: '10px',
        border: '1px solid #e2e0f0', background: h ? '#f0ebff' : '#fff',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: h ? '#7c5cbf' : '#7a7a9a',
        transition: 'all 0.15s ease',
        borderColor: h ? '#b8a8e0' : '#e2e0f0',
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </button>
  );
}

function IconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      style={{
        width: '30px', height: '30px', flexShrink: 0, border: 'none',
        background: 'transparent', cursor: 'pointer', color: h ? '#7c5cbf' : '#9090b0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, transition: 'color 0.15s ease',
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </button>
  );
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3H6.6a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.27 18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}