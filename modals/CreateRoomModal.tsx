"use client";

// ============================================================
// src/components/modals/CreateRoomModal.tsx
// ============================================================

import React, { useRef, useState } from 'react';
import { useChatContext } from '@/context/ChatContext';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateRoomModal({ onClose, onCreated }: CreateRoomModalProps) {
  const { createRoom } = useChatContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) { setError('Room name is required'); return; }
    setLoading(true);
    try {
      await createRoom(name.trim(), description.trim() || undefined, isPrivate);
      onCreated?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        style={{
          background: '#ffffff', borderRadius: '24px', padding: '28px',
          width: '100%', maxWidth: '440px',
          boxShadow: '0 24px 80px rgba(100,80,160,0.18)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '17px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            Create Room
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '8px', border: 'none',
              background: '#f0ebff', color: '#7c5cbf', cursor: 'pointer',
              fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ebff'; (e.currentTarget as HTMLButtonElement).style.color = '#7c5cbf'; }}
          >
            ×
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f5', border: '1px solid #fecaca', color: '#ef4444',
            fontSize: '13px', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Name */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a7a9a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Room Name
        </label>
        <input
          ref={nameRef}
          type="text"
          placeholder="e.g. design-team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '11px 14px',
            border: '1.5px solid #e2e0f0', borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
            background: '#fafafa', outline: 'none', marginBottom: '16px',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#7c5cbf')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e0f0')}
        />

        {/* Description */}
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a7a9a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Description{' '}
          <span style={{ fontWeight: 400, textTransform: 'none', color: '#c0bed8' }}>(optional)</span>
        </label>
        <input
          type="text"
          placeholder="What's this room for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '11px 14px',
            border: '1.5px solid #e2e0f0', borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
            background: '#fafafa', outline: 'none', marginBottom: '20px',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#7c5cbf')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e0f0')}
        />

        {/* Private toggle */}
        <label
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '24px', cursor: 'pointer',
          }}
        >
          <div
            onClick={() => setIsPrivate(!isPrivate)}
            style={{
              width: '38px', height: '22px', borderRadius: '11px', flexShrink: 0,
              background: isPrivate ? '#7c5cbf' : '#e2e0f0',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <div
              style={{
                position: 'absolute', top: '3px',
                left: isPrivate ? '19px' : '3px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                transition: 'left 0.2s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 500 }}>
            Private room
          </span>
          {isPrivate && (
            <span style={{ fontSize: '11px', color: '#7c5cbf', background: '#f0ebff', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              Invite only
            </span>
          )}
        </label>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: loading ? '#b8a8e0' : '#7c5cbf',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(98,65,168,0.3)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#6241a8'; }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; }}
        >
          {loading ? 'Creating…' : 'Create Room'}
        </button>
      </div>
    </div>
  );
}