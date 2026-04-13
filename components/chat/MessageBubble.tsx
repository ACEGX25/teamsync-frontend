"use client";

// ============================================================
// src/components/chat/MessageBubble.tsx
// ============================================================

import React, { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import type { Message } from '@/types/types';

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function MessageBubble({ message, isMine, showAvatar }: MessageBubbleProps) {
  const { editMessage, deleteMessage } = useChatContext();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const initials = (message.sender?.displayName || message.sender?.username || '?')
    .charAt(0).toUpperCase();

  const handleEdit = () => {
    if (editValue.trim() && editValue !== message.content) {
      editMessage(message.id, editValue.trim());
    }
    setEditing(false);
  };

  if (message.isDeleted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: isMine ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '2px 0',
          marginLeft: isMine ? 0 : showAvatar ? 0 : '38px',
        }}
      >
        <div
          style={{
            padding: '8px 14px',
            borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: '#fafafa',
            border: '1px solid #e2e0f0',
            color: '#9090b0',
            fontSize: '13px',
            fontStyle: 'italic',
          }}
        >
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMine ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '8px',
        padding: '2px 0',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar (only for received, and only when showAvatar) */}
      {!isMine && (
        <div style={{ width: '30px', flexShrink: 0, alignSelf: 'flex-end' }}>
          {showAvatar ? (
            <div
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '11px', fontWeight: 600, overflow: 'hidden',
              }}
            >
              {message.sender?.avatarUrl
                ? <img src={message.sender.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
          ) : null}
        </div>
      )}

      {/* Bubble */}
      <div style={{ maxWidth: '68%', position: 'relative' }}>
        {/* Action toolbar */}
        {hovered && !editing && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              [isMine ? 'left' : 'right']: 0,
              background: '#fff',
              border: '1px solid #e2e0f0',
              borderRadius: '10px',
              padding: '4px',
              display: 'flex',
              gap: '2px',
              boxShadow: '0 4px 16px rgba(100,80,160,0.1)',
              zIndex: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {isMine && (
              <>
                <ActionBtn
                  title="Edit"
                  onClick={() => { setEditing(true); setEditValue(message.content); }}
                  hoverStyle={{ background: '#f0ebff', color: '#7c5cbf' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ActionBtn>
                <ActionBtn
                  title="Delete"
                  onClick={() => { if (window.confirm('Delete this message?')) deleteMessage(message.id); }}
                  hoverStyle={{ background: '#fff5f5', color: '#ef4444' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ActionBtn>
              </>
            )}
          </div>
        )}

        {/* Content */}
        {editing ? (
          <div>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEdit(); }
                if (e.key === 'Escape') setEditing(false);
              }}
              autoFocus
              rows={2}
              style={{
                padding: '9px 13px', borderRadius: '14px',
                border: '1.5px solid #7c5cbf', background: '#fff',
                fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
                lineHeight: 1.5, outline: 'none', resize: 'none', width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <button
                onClick={() => setEditing(false)}
                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '1px solid #e2e0f0', background: '#fff', color: '#7a7a9a', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: 'none', background: '#7c5cbf', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: isMine ? '#7c5cbf' : '#ffffff',
              color: isMine ? '#fff' : '#1a1a2e',
              padding: '10px 14px',
              borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              fontSize: '14px', lineHeight: 1.55,
              boxShadow: isMine
                ? '0 2px 8px rgba(124,92,191,0.25)'
                : '0 2px 8px rgba(0,0,0,0.05)',
              wordBreak: 'break-word',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: escapeHtml(message.content) }} />
            {message.isEdited && (
              <span style={{ fontSize: '10px', opacity: 0.65, marginLeft: '6px' }}>(edited)</span>
            )}
          </div>
        )}

        {/* Timestamp + read receipt */}
        {!editing && (
          <div
            style={{
              fontSize: '10px', color: '#9090b0',
              textAlign: isMine ? 'right' : 'left',
              marginTop: '3px', padding: '0 3px',
              display: 'flex', alignItems: 'center',
              justifyContent: isMine ? 'flex-end' : 'flex-start',
              gap: '3px',
            }}
          >
            {formatTime(message.createdAt)}
            {isMine && (
              <svg width="13" height="8" viewBox="0 0 16 10" fill="none">
                <path d="M1 5l3 3L14 1" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 5l3 3 7-7" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tiny action button ─────────────────────────────────────────────────────────

interface ActionBtnProps {
  title: string;
  onClick: () => void;
  hoverStyle: React.CSSProperties;
  children: React.ReactNode;
}

function ActionBtn({ title, onClick, hoverStyle, children }: ActionBtnProps) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: '26px', height: '26px', border: 'none', background: 'transparent',
        borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#7a7a9a',
        transition: 'all 0.12s ease',
        ...(h ? hoverStyle : {}),
      }}
    >
      {children}
    </button>
  );
}