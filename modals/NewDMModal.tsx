"use client";

// ============================================================
// src/components/modals/NewDMModal.tsx
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import type { ChatUser } from '@/types/types';

interface NewDMModalProps {
  onClose: () => void;
}

export function NewDMModal({ onClose }: NewDMModalProps) {
  const { searchUsers, setActivePeer, dmConversations } = useChatContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (q.length < 2) { setResults([]); return; }
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const users = await searchUsers(q);
          setResults(users);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 280);
    },
    [searchUsers]
  );

  const handleSelectUser = useCallback(
    (user: ChatUser) => {
      // Ensure conversation entry exists
      if (!dmConversations.has(user.id)) {
        // It will be created when the first message is sent
      }
      setActivePeer(user);
      onClose();
    },
    [dmConversations, setActivePeer, onClose]
  );

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(26,26,46,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 24px 80px rgba(100,80,160,0.18)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '17px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            New Direct Message
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '8px', border: 'none',
              background: '#f0ebff', color: '#7c5cbf', cursor: 'pointer',
              fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ebff'; (e.currentTarget as HTMLButtonElement).style.color = '#7c5cbf'; }}
          >
            ×
          </button>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9090b0', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name or username…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '11px 14px 11px 36px',
              border: '1.5px solid #e2e0f0', borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
              background: '#fafafa', outline: 'none', transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#7c5cbf')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e0f0')}
          />
        </div>

        {/* Results */}
        <div
          style={{
            maxHeight: '280px', overflowY: 'auto',
            borderRadius: '14px', border: '1px solid #ece9f8',
          }}
        >
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9090b0', fontSize: '13px' }}>
              Searching…
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9090b0', fontSize: '13px' }}>
              No users found for "{query}"
            </div>
          )}

          {!loading && results.map((user) => {
            const initials = (user.displayName || user.username || '?').charAt(0).toUpperCase();
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s ease',
                  borderRadius: '10px', margin: '4px',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0ebff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                    background: user.avatarUrl ? 'transparent' : 'linear-gradient(135deg,#a78bfa,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '14px', fontWeight: 600,
                    overflow: 'hidden',
                  }}
                >
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>
                    {user.displayName || user.username}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9090b0' }}>@{user.username}</div>
                </div>
              </button>
            );
          })}

          {query.length < 2 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#c0bed8', fontSize: '13px' }}>
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}