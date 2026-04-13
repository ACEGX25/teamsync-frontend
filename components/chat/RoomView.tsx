"use client";

// ============================================================
// src/components/chat/RoomsView.tsx
// ============================================================

import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { CreateRoomModal } from '@/modals/CreateRoomModal';
import type { Room } from '@/types/types';

export function RoomsView() {
  const { rooms, roomsLoading, loadRooms, joinRoom } = useChatContext();
  const [showCreate, setShowCreate] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const handleJoin = async (roomId: string) => {
    setJoiningId(roomId);
    try {
      await joinRoom(roomId);
      await loadRooms();
    } catch (e) {
      console.error('join room', e);
    } finally {
      setJoiningId(null);
    }
  };

  const filtered = rooms.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q);
  });

  return (
    <div
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg,#e8e4f3 0%,#f0eef8 50%,#e8ecf5 100%)',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', width: '100%', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '22px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>
              Rooms
            </h1>
            <p style={{ fontSize: '13px', color: '#7a7a9a', margin: 0 }}>
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: '10px 20px', background: '#7c5cbf', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,92,191,0.3)',
              transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: '6px',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#6241a8'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> New Room
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9090b0', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search rooms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 36px',
              border: '1.5px solid #e2e0f0', borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#1a1a2e',
              background: '#ffffff', outline: 'none', transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#7c5cbf')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e0f0')}
          />
        </div>

        {/* Loading */}
        {roomsLoading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9090b0', fontSize: '14px' }}>
            Loading rooms…
          </div>
        )}

        {/* Empty */}
        {!roomsLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#c0bed8' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, marginBottom: '12px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>
              {search ? `No rooms matching "${search}"` : 'No rooms yet'}
            </p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              {!search && 'Create one to get started'}
            </p>
          </div>
        )}

        {/* Room cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              joining={joiningId === room.id}
              onJoin={() => handleJoin(room.id)}
            />
          ))}
        </div>
      </div>

      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreated={() => loadRooms()}
        />
      )}
    </div>
  );
}

// ── Room Card ──────────────────────────────────────────────────────────────────

interface RoomCardProps {
  room: Room;
  joining: boolean;
  onJoin: () => void;
}

function RoomCard({ room, joining, onJoin }: RoomCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff', borderRadius: '16px',
        padding: '18px 22px',
        boxShadow: hovered
          ? '0 6px 24px rgba(100,80,160,0.12)'
          : '0 2px 12px rgba(100,80,160,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', transition: 'box-shadow 0.15s ease',
      }}
    >
      {/* Room icon */}
      <div
        style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: room.isPrivate ? '#fff0eb' : '#f0ebff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          {room.isPrivate
            ? <><rect x="3" y="11" width="18" height="11" rx="2" stroke="#f59e0b" strokeWidth="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" /></>
            : <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#7c5cbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>
            # {room.name}
          </span>
          {room.isPrivate && (
            <span style={{ fontSize: '10px', background: '#fff7ed', color: '#f59e0b', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              Private
            </span>
          )}
          {room.isMember && (
            <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              {room.myRole === 'OWNER' ? 'Owner' : room.myRole === 'ADMIN' ? 'Admin' : 'Member'}
            </span>
          )}
        </div>
        {room.description && (
          <p style={{ fontSize: '13px', color: '#7a7a9a', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {room.description}
          </p>
        )}
        <div style={{ fontSize: '12px', color: '#9090b0' }}>
          {room.memberCount} member{room.memberCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Join button */}
      {!room.isMember && !room.isPrivate && (
        <button
          onClick={onJoin}
          disabled={joining}
          style={{
            padding: '8px 18px', background: joining ? '#b8a8e0' : '#7c5cbf',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600,
            cursor: joining ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease', whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (!joining) (e.currentTarget as HTMLButtonElement).style.background = '#6241a8'; }}
          onMouseLeave={(e) => { if (!joining) (e.currentTarget as HTMLButtonElement).style.background = '#7c5cbf'; }}
        >
          {joining ? 'Joining…' : 'Join'}
        </button>
      )}
    </div>
  );
}