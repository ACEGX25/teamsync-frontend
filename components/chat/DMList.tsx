"use client";

// ============================================================
// src/components/chat/DMList.tsx
// ============================================================

import React, { useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import type { ChatUser, DMConversation } from '@/types/types';

interface DMListProps {
  onNewDM: () => void;
}

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function Avatar({ user, size = 42 }: { user: ChatUser; size?: number }) {
  const initials = (user.displayName || user.username || '?').charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: size * 0.36, fontWeight: 600,
        overflow: 'hidden',
      }}
    >
      {user.avatarUrl
        ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials}
    </div>
  );
}

export function DMList({ onNewDM }: DMListProps) {
  const { dmConversations, activePeer, setActivePeer, onlineUserIds } = useChatContext();
  const [search, setSearch] = useState('');

  const convos = Array.from(dmConversations.values()).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.peer.username.toLowerCase().includes(q) ||
      (c.peer.displayName ?? '').toLowerCase().includes(q)
    );
  });

  // Sort by lastTime desc, unread first
  convos.sort((a, b) => {
    if (b.unread !== a.unread) return b.unread - a.unread;
    if (!a.lastTime) return 1;
    if (!b.lastTime) return -1;
    return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
  });

  return (
    <aside
      style={{
        width: '300px', minWidth: '300px', background: '#ffffff',
        borderRight: '1px solid #ece9f8',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid #ece9f8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif", fontSize: '16px', fontWeight: 700,
              color: '#1a1a2e', margin: 0,
            }}
          >
            Direct Messages
          </h2>
          <button
            onClick={onNewDM}
            title="New DM"
            style={{
              width: '30px', height: '30px', borderRadius: '8px', border: 'none',
              background: '#f0ebff', color: '#7c5cbf', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', lineHeight: 1, transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ebff'; (e.currentTarget as HTMLButtonElement).style.color = '#7c5cbf'; }}
          >
            +
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9090b0', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '8px 12px 8px 30px',
              border: '1.5px solid #e2e0f0', borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#1a1a2e',
              background: '#fafafa', outline: 'none', transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#7c5cbf')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e0f0')}
          />
        </div>
      </div>

      {/* Conversations */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {convos.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#c0bed8', fontSize: '13px', lineHeight: 1.6 }}>
            {search ? `No conversations matching "${search}"` : 'No conversations yet.\nStart a new DM ↑'}
          </div>
        )}

        {convos.map((convo) => (
          <DMItem
            key={convo.peer.id}
            convo={convo}
            isActive={activePeer?.id === convo.peer.id}
            isOnline={onlineUserIds.has(convo.peer.id)}
            onClick={() => setActivePeer(convo.peer)}
          />
        ))}
      </div>
    </aside>
  );
}

// ── DM Item ────────────────────────────────────────────────────────────────────

interface DMItemProps {
  convo: DMConversation;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
}

function DMItem({ convo, isActive, isOnline, onClick }: DMItemProps) {
  const [hovered, setHovered] = useState(false);
  const highlighted = isActive || hovered;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '11px 12px', borderRadius: '12px', cursor: 'pointer',
        background: highlighted ? '#f0ebff' : 'transparent',
        borderLeft: `3px solid ${isActive ? '#7c5cbf' : 'transparent'}`,
        transition: 'all 0.12s ease', marginBottom: '2px',
        outline: 'none',
      }}
    >
      {/* Avatar + online dot */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '15px', fontWeight: 600,
            overflow: 'hidden',
          }}
        >
          {convo.peer.avatarUrl
            ? <img src={convo.peer.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (convo.peer.displayName || convo.peer.username || '?').charAt(0).toUpperCase()}
        </div>
        <span
          style={{
            position: 'absolute', bottom: '1px', right: '1px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: isOnline ? '#10b981' : '#d1d5db',
            border: '2px solid #fff',
            transition: 'background 0.3s ease',
          }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <span
            style={{
              fontSize: '14px', fontWeight: convo.unread ? 700 : 600,
              color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', maxWidth: '140px',
            }}
          >
            {convo.peer.displayName || convo.peer.username}
          </span>
          <span style={{ fontSize: '11px', color: '#9090b0', flexShrink: 0, marginLeft: '6px' }}>
            {formatTime(convo.lastTime)}
          </span>
        </div>
        <div
          style={{
            fontSize: '12px',
            color: convo.unread ? '#7c5cbf' : '#9090b0',
            fontWeight: convo.unread ? 600 : 400,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
        >
          {convo.lastMessage || 'No messages yet'}
        </div>
      </div>

      {/* Unread badge */}
      {convo.unread > 0 && (
        <div
          style={{
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#7c5cbf', color: '#fff',
            fontSize: '10px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {convo.unread > 9 ? '9+' : convo.unread}
        </div>
      )}
    </div>
  );
}