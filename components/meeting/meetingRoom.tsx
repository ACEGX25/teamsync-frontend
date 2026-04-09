"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  name: string;
  initials: string;
  color: string;
  micOn: boolean;
  speaking: boolean;
  stream?: MediaStream;
}

export interface ChatMessage {
  id: string;
  type: "message" | "system";
  from?: string;
  fromId?: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

interface MeetingRoomProps {
  meetingId: string;
  currentUser: {
    id: string;
    name: string;
    initials: string;
    color: string;
  };
  /** WebSocket URL e.g. "wss://your-api/meetings/MEETING_ID" */
  wsUrl: string;
  onLeave?: () => void;
}

type MeetingViewMode = "grid" | "focus";

const styles = {
  avatar: "tmr-avatar",
  participantCard: "tmr-participantCard",
  speaking: "tmr-speaking",
  participantVideo: "tmr-participantVideo",
  pName: "tmr-pName",
  pMic: "tmr-pMic",
  micOn: "tmr-micOn",
  micOff: "tmr-micOff",
  root: "tmr-root",
  nav: "tmr-nav",
  navLogo: "tmr-navLogo",
  navCenter: "tmr-navCenter",
  viewTabs: "tmr-viewTabs",
  viewTabBtn: "tmr-viewTabBtn",
  viewTabBtnActive: "tmr-viewTabBtnActive",
  navTab: "tmr-navTab",
  navTabActive: "tmr-navTabActive",
  navRight: "tmr-navRight",
  timer: "tmr-timer",
  timerWarn: "tmr-timerWarn",
  timerDot: "tmr-timerDot",
  wsWarn: "tmr-wsWarn",
  iconBtn: "tmr-iconBtn",
  body: "tmr-body",
  stage: "tmr-stage",
  stageGrid: "tmr-stageGrid",
  stageTheater: "tmr-stageTheater",
  stageCompact: "tmr-stageCompact",
  gridTiles: "tmr-gridTiles",
  screenArea: "tmr-screenArea",
  screenLabel: "tmr-screenLabel",
  screenDot: "tmr-screenDot",
  screenVideo: "tmr-screenVideo",
  screenPlaceholder: "tmr-screenPlaceholder",
  screenPlaceholderIcon: "tmr-screenPlaceholderIcon",
  screenPlaceholderSub: "tmr-screenPlaceholderSub",
  pip: "tmr-pip",
  pipActive: "tmr-pipActive",
  pipName: "tmr-pipName",
  participantsRow: "tmr-participantsRow",
  emptyParticipants: "tmr-emptyParticipants",
  controls: "tmr-controls",
  ctrlBtn: "tmr-ctrlBtn",
  ctrlActive: "tmr-ctrlActive",
  endBtn: "tmr-endBtn",
  sidebar: "tmr-sidebar",
  sidebarHead: "tmr-sidebarHead",
  sidebarHeadRight: "tmr-sidebarHeadRight",
  messages: "tmr-messages",
  sysMsg: "tmr-sysMsg",
  msg: "tmr-msg",
  msgSelf: "tmr-msgSelf",
  msgMeta: "tmr-msgMeta",
  msgAuthor: "tmr-msgAuthor",
  badgeYou: "tmr-badgeYou",
  msgTime: "tmr-msgTime",
  msgBubble: "tmr-msgBubble",
  chatInputWrap: "tmr-chatInputWrap",
  chatInputInner: "tmr-chatInputInner",
  chatInput: "tmr-chatInput",
  sendBtn: "tmr-sendBtn",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(d = new Date()) {
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
}

function formatDuration(s: number) {
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({
  initials,
  color,   
  size = 38,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

function ParticipantCard({ p }: { p: Participant }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && p.stream) {
      videoRef.current.srcObject = p.stream;
    }
  }, [p.stream]);

  return (
    <div className={`${styles.participantCard} ${p.speaking ? styles.speaking : ""}`}>
      {p.stream ? (
        <video ref={videoRef} autoPlay muted className={styles.participantVideo} />
      ) : (
        <Avatar initials={p.initials} color={p.color} size={38} />
      )}
      <span className={styles.pName}>{p.name}</span>
      <span className={`${styles.pMic} ${p.micOn ? styles.micOn : styles.micOff}`}>
        {p.micOn ? "🎙" : "🔇"}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MeetingRoom({
  meetingId,
  currentUser,
  wsUrl,
  onLeave,
}: MeetingRoomProps) {
  // ── State ──
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [viewMode, setViewMode] = useState<MeetingViewMode>("grid");
  const [elapsed, setElapsed] = useState(0);

    const meetingTiles: Participant[] = [
      {
        id: currentUser.id,
        name: `${currentUser.name} (You)`,
        initials: currentUser.initials,
        color: currentUser.color,
        micOn,
        speaking: false,
      },
      ...participants,
    ];

    const stageClassName = [
      styles.stage,
      viewMode === "grid" ? styles.stageGrid : "",
    ]
      .filter(Boolean)
      .join(" ");
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  );

  // ── Refs ──
  const wsRef = useRef<WebSocket | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Timer ──
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Demo Participants (for testing) ──
  useEffect(() => {
    // Add demo participants for UI testing
    const demoParticipants: Participant[] = [
      {
        id: "demo-user-1",
        name: "Sarah Johnson",
        initials: "SJ",
        color: "#10b981",
        micOn: true,
        speaking: false,
      },
      {
        id: "demo-user-2",
        name: "Mike Chen",
        initials: "MC",
        color: "#f59e0b",
        micOn: true,
        speaking: false,
      },
      {
        id: "demo-user-3",
        name: "Emma Wilson",
        initials: "EW",
        color: "#ef4444",
        micOn: false,
        speaking: false,
      },
      {
        id: "demo-user-4",
        name: "David Park",
        initials: "DP",
        color: "#8b5cf6",
        micOn: true,
        speaking: false,
      },
      {
        id: "demo-user-5",
        name: "Lisa Martinez",
        initials: "LM",
        color: "#3b82f6",
        micOn: true,
        speaking: false,
      },
      {
        id: "demo-user-6",
        name: "James Taylor",
        initials: "JT",
        color: "#06b6d4",
        micOn: false,
        speaking: false,
      },
    ];
    setParticipants(demoParticipants);
  }, []);

  // ── WebSocket ──
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
      ws.send(
        JSON.stringify({
          type: "join",
          meetingId,
          user: currentUser,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        handleServerMessage(msg);
      } catch {
        console.error("WS parse error", event.data);
      }
    };

    ws.onerror = () => setWsStatus("disconnected");
    ws.onclose = () => setWsStatus("disconnected");

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, meetingId]);

  // ── Handle incoming WS messages ──
  const handleServerMessage = useCallback(
    (msg: Record<string, unknown>) => {
      switch (msg.type) {
        case "participant_joined": {
          const p = msg.participant as Participant;
          setParticipants((prev) =>
            prev.find((x) => x.id === p.id) ? prev : [...prev, p]
          );
          addSystemMsg(`${p.name} joined`);
          break;
        }
        case "participant_left": {
          const { userId, userName } = msg as { userId: string; userName: string };
          setParticipants((prev) => prev.filter((p) => p.id !== userId));
          addSystemMsg(`${userName} left`);
          break;
        }
        case "chat_message": {
          const { fromId, from, text, time } = msg as {
            fromId: string;
            from: string;
            text: string;
            time: string;
          };
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              type: "message",
              from,
              fromId,
              text,
              time,
              isSelf: fromId === currentUser.id,
            },
          ]);
          break;
        }
        case "speaking": {
          const { userId, active } = msg as { userId: string; active: boolean };
          setParticipants((prev) =>
            prev.map((p) => (p.id === userId ? { ...p, speaking: active } : p))
          );
          break;
        }
        case "participants_list": {
          const list = msg.participants as Participant[];
          setParticipants(list.filter((p) => p.id !== currentUser.id));
          break;
        }
        case "chat_history": {
          const history = msg.messages as ChatMessage[];
          setMessages(history);
          break;
        }
        default:
          break;
      }
    },
    [currentUser.id]
  );

  // ── Scroll chat to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Helpers ──
  function addSystemMsg(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "system", text, time: formatTime() },
    ]);
  }

  function wsSend(data: object) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }

  // ── Controls ──
  async function toggleMic() {
    if (!localStreamRef.current) {
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        alert("Microphone access denied.");
        return;
      }
    }
    const enabled = !micOn;
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = enabled));
    setMicOn(enabled);
    wsSend({ type: "mic_toggle", userId: currentUser.id, micOn: enabled });
  }

  async function toggleCam() {
    // Audio-only meeting per scope — camera stub kept for future use
    setCamOn((v) => !v);
  }

  async function toggleShare() {
    if (sharing) {
      // Stop sharing
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      setSharing(false);
      wsSend({ type: "screen_share_stopped", userId: currentUser.id });
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 15 },
          audio: false,
        });
        screenStreamRef.current = stream;

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.play().catch(() => {});
        }

        // Auto-stop when user stops via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setSharing(false);
          screenStreamRef.current = null;
          if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
          wsSend({ type: "screen_share_stopped", userId: currentUser.id });
        };

        setSharing(true);
        wsSend({ type: "screen_share_started", userId: currentUser.id, userName: currentUser.name });
      } catch (err) {
        // User cancelled or permission denied — silently ignore
        console.warn("Screen share cancelled", err);
      }
    }
  }

  function sendMessage() {
    const text = chatInput.trim();
    if (!text) return;
    const time = formatTime();
    // Optimistically add to local state
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "message",
        from: currentUser.name,
        fromId: currentUser.id,
        text,
        time,
        isSelf: true,
      },
    ]);
    wsSend({ type: "chat_message", from: currentUser.name, fromId: currentUser.id, text, time });
    setChatInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function endMeeting() {
    if (confirm("End the meeting for everyone?")) {
      wsSend({ type: "end_meeting", userId: currentUser.id });
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      onLeave?.();
    }
  }

  // ── Render ──
  return (
    <div className={styles.root}>
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          Team<span>Sync</span>
          <span style={{ marginLeft: '24px', fontSize: '14px', fontWeight: 500, color: 'var(--meet-accent)' }}>
            {currentUser.name}
          </span>
        </div>
        <div className={styles.navCenter}>
          <div className={styles.viewTabs}>
            <button
              className={`${styles.viewTabBtn} ${viewMode === "grid" ? styles.viewTabBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`${styles.viewTabBtn} ${viewMode === "focus" ? styles.viewTabBtnActive : ""}`}
              onClick={() => setViewMode("focus")}
            >
              Focus
            </button>
          </div>
        </div>
        <div className={styles.navRight}>
          <div className={`${styles.timer} ${wsStatus === "disconnected" ? styles.timerWarn : ""}`}>
            <div className={styles.timerDot} />
            <span>{formatDuration(elapsed)}</span>
          </div>
          {wsStatus === "disconnected" && (
            <span className={styles.wsWarn}>⚠ Reconnecting…</span>
          )}
          <div className={styles.iconBtn}>🔔</div>
          <div className={styles.iconBtn}>⚙</div>
          <Avatar initials={currentUser.initials} color={currentUser.color} size={32} />
        </div>
      </nav>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* ── Stage ── */}
        <div className={stageClassName}>
          {viewMode === "grid" ? (
            <div className={styles.gridTiles}>
              {meetingTiles.map((p) => (
                <ParticipantCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <>
          {/* Screen area */}
          <div className={styles.screenArea}>
            {sharing && (
              <div className={styles.screenLabel}>
                <div className={styles.screenDot} />
                <span>YOUR SCREEN</span>
              </div>
            )}

            {sharing ? (
              <video
                ref={screenVideoRef}
                autoPlay
                muted
                className={styles.screenVideo}
              />
            ) : (
              <div className={styles.screenPlaceholder}>
                <div className={styles.screenPlaceholderIcon}>🖥</div>
                <span>No screen being shared</span>
                <span className={styles.screenPlaceholderSub}>
                  Click &quot;Share Screen&quot; below to present
                </span>
              </div>
            )}

            {/* Self PiP */}
            <div className={`${styles.pip} ${micOn ? styles.pipActive : ""}`}>
              <Avatar initials={currentUser.initials} color={currentUser.color} size={40} />
              <span className={styles.pipName}>{currentUser.name} (You)</span>
            </div>
          </div>
            </>
          )}

          {/* Participants strip */}
          <div className={styles.participantsRow}>
            {participants.length === 0 ? (
              <span className={styles.emptyParticipants}>Waiting for others to join…</span>
            ) : (
              participants.map((p) => <ParticipantCard key={p.id} p={p} />)
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={`${styles.ctrlBtn} ${micOn ? styles.ctrlActive : ""}`}
              onClick={toggleMic}
            >
              <span>{micOn ? "🎙" : "🔇"}</span>
              {micOn ? "Mute" : "Unmute"}
            </button>

            <button
              className={`${styles.ctrlBtn} ${camOn ? styles.ctrlActive : ""}`}
              onClick={toggleCam}
            >
              <span>📷</span>
              {camOn ? "Stop Camera" : "Camera"}
            </button>

            <button
              className={`${styles.ctrlBtn} ${sharing ? styles.ctrlActive : ""}`}
              onClick={toggleShare}
            >
              <span>🖥</span>
              {sharing ? "Stop Sharing" : "Share Screen"}
            </button>

            <button
              className={`${styles.ctrlBtn} ${showChat ? styles.ctrlActive : ""}`}
              onClick={() => setShowChat((v) => !v)}
            >
              <span>💬</span>
              Chat
            </button>

            <button className={styles.ctrlBtn}>
              <span>⋯</span>
            </button>

            <button className={`${styles.ctrlBtn} ${styles.endBtn}`} onClick={endMeeting}>
              📞 End Meeting
            </button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        {showChat && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHead}>
              <h3>Live Chat</h3>
              <div className={styles.sidebarHeadRight}>
                <div className={styles.iconBtn} style={{ width: 26, height: 26, fontSize: 13 }}>
                  👥
                </div>
                <div
                  className={styles.iconBtn}
                  style={{ width: 26, height: 26, fontSize: 13 }}
                  onClick={() => setShowChat(false)}
                >
                  ✕
                </div>
              </div>
            </div>

            <div className={styles.messages}>
              {messages.map((m) =>
                m.type === "system" ? (
                  <div key={m.id} className={styles.sysMsg}>
                    {m.text}
                  </div>
                ) : (
                  <div key={m.id} className={`${styles.msg} ${m.isSelf ? styles.msgSelf : ""}`}>
                    <div className={styles.msgMeta}>
                      <span className={styles.msgAuthor}>{m.from}</span>
                      {m.isSelf && <span className={styles.badgeYou}>You</span>}
                      <span className={styles.msgTime}>{m.time}</span>
                    </div>
                    <div className={styles.msgBubble}>{m.text}</div>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInputWrap}>
              <div className={styles.chatInputInner}>
                <input
                  className={styles.chatInput}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message…"
                />
                <button className={styles.sendBtn} onClick={sendMessage}>
                  ➤
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}   