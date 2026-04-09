"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  wsUrl: string;
  onLeave?: () => void;
}

type MeetingViewMode = "grid" | "focus";

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

function avatarToneClass(color: string) {
  const c = color.toLowerCase();
  if (c.includes("10b981") || c.includes("059669") || c.includes("green")) {
    return "from-[var(--color-db-avatar-green-start)] to-[var(--color-db-avatar-green-end)]";
  }
  if (c.includes("f59e0b") || c.includes("warn") || c.includes("amber")) {
    return "from-[var(--color-db-avatar-amber-start)] to-[var(--color-db-avatar-amber-end)]";
  }
  if (c.includes("ef4444") || c.includes("e11d48") || c.includes("red")) {
    return "from-[var(--color-db-avatar-red-start)] to-[var(--color-db-avatar-red-end)]";
  }
  if (c.includes("3b82f6") || c.includes("06b6d4") || c.includes("blue")) {
    return "from-[var(--color-db-avatar-blue-start)] to-[var(--color-db-avatar-blue-end)]";
  }
  return "from-[var(--color-db-avatar-gradient-start)] to-[var(--color-db-avatar-gradient-end)]";
}

function avatarSizeClass(size: number) {
  if (size === 32) return "h-8 w-8 text-[11px]";
  if (size === 40) return "h-10 w-10 text-[13px]";
  return "h-[38px] w-[38px] text-[12px]";
}

function Avatar({ initials, color, size = 38 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarToneClass(color)} font-bold text-[var(--color-surface)] ${avatarSizeClass(size)}`}
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
    <div
      className={`relative flex h-20 w-[140px] shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border bg-[var(--color-landing-input-bg)] p-2 ${
        p.speaking
          ? "border-[var(--color-success)] shadow-[0_0_0_1px_var(--color-success)]"
          : "border-[var(--color-landing-input-border)]"
      }`}
    >
      {p.stream ? (
        <video ref={videoRef} autoPlay muted className="h-full w-full rounded-lg object-cover" />
      ) : (
        <Avatar initials={p.initials} color={p.color} size={38} />
      )}

      <span
        className={`max-w-[120px] truncate text-[11px] font-semibold ${
          p.stream
            ? "absolute bottom-2 left-2 rounded-full bg-[var(--color-overlay-dark)] px-2 py-0.5 text-[var(--color-surface)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {p.name}
      </span>

      <span
        className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] ${
          p.stream ? "absolute right-2 top-2" : ""
        } ${p.micOn ? "bg-[var(--color-meeting-mic-on-bg)] text-[var(--color-meeting-mic-on-text)]" : "bg-[var(--color-error-bg)] text-[var(--color-error)]"}`}
      >
        {p.micOn ? "🎙" : "🔇"}
      </span>
    </div>
  );
}

export default function MeetingRoom({ meetingId, currentUser, wsUrl, onLeave }: MeetingRoomProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [viewMode, setViewMode] = useState<MeetingViewMode>("grid");
  const [elapsed, setElapsed] = useState(0);
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

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

  const wsRef = useRef<WebSocket | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const demoParticipants: Participant[] = [
      { id: "demo-user-1", name: "Sarah Johnson", initials: "SJ", color: "green", micOn: true, speaking: false },
      { id: "demo-user-2", name: "Mike Chen", initials: "MC", color: "amber", micOn: true, speaking: false },
      { id: "demo-user-3", name: "Emma Wilson", initials: "EW", color: "red", micOn: false, speaking: false },
      { id: "demo-user-4", name: "David Park", initials: "DP", color: "violet", micOn: true, speaking: false },
      { id: "demo-user-5", name: "Lisa Martinez", initials: "LM", color: "blue", micOn: true, speaking: false },
      { id: "demo-user-6", name: "James Taylor", initials: "JT", color: "blue", micOn: false, speaking: false },
    ];
    setParticipants(demoParticipants);
  }, []);

  const handleServerMessage = useCallback(
    (msg: Record<string, unknown>) => {
      switch (msg.type) {
        case "participant_joined": {
          const p = msg.participant as Participant;
          setParticipants((prev) => (prev.find((x) => x.id === p.id) ? prev : [...prev, p]));
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
          setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, speaking: active } : p)));
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

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
      ws.send(JSON.stringify({ type: "join", meetingId, user: currentUser }));
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

    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, meetingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addSystemMsg(text: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), type: "system", text, time: formatTime() }]);
  }

  function wsSend(data: object) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }

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
    setCamOn((v) => !v);
  }

  async function toggleShare() {
    if (sharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      setSharing(false);
      wsSend({ type: "screen_share_stopped", userId: currentUser.id });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 }, audio: false });
      screenStreamRef.current = stream;

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play().catch(() => {});
      }

      stream.getVideoTracks()[0].onended = () => {
        setSharing(false);
        screenStreamRef.current = null;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
        wsSend({ type: "screen_share_stopped", userId: currentUser.id });
      };

      setSharing(true);
      wsSend({ type: "screen_share_started", userId: currentUser.id, userName: currentUser.name });
    } catch (err) {
      console.warn("Screen share cancelled", err);
    }
  }

  function sendMessage() {
    const text = chatInput.trim();
    if (!text) return;
    const time = formatTime();

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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-dashboard)] text-[var(--color-text-primary)] font-[var(--font-base)]">
      <nav className="h-[52px] shrink-0 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-5 flex items-center justify-between gap-4">
        <div className="flex items-center whitespace-nowrap text-[15px] font-bold">
          Team<span className="ml-px text-[var(--color-brand)]">Sync</span>
          <span className="ml-6 text-sm font-medium text-[var(--color-brand)]">{currentUser.name}</span>
        </div>

        <div className="inline-flex gap-1.5 rounded-xl border border-[var(--color-landing-input-border)] bg-[var(--color-landing-input-bg)] p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === "grid"
                ? "bg-[var(--color-surface)] text-[var(--color-brand-deep)] shadow-[var(--shadow-meeting-toggle-active)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode("focus")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === "focus"
                ? "bg-[var(--color-surface)] text-[var(--color-brand-deep)] shadow-[var(--shadow-meeting-toggle-active)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            Focus
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-error)] bg-[var(--color-error-bg)] px-2.5 py-1 text-xs text-[var(--color-error)] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-error)]" />
            <span>{formatDuration(elapsed)}</span>
          </div>

          {wsStatus === "disconnected" && (
            <span className="rounded-md bg-[var(--color-status-warn-bg)] px-2 py-[3px] text-[11px] font-semibold text-[var(--color-warn)]">
              ⚠ Reconnecting...
            </span>
          )}

          <div className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[15px]">🔔</div>
          <div className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[15px]">⚙</div>
          <Avatar initials={currentUser.initials} color={currentUser.color} size={32} />
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-hidden p-4">
          {viewMode === "grid" ? (
            <div className="grid h-full min-h-0 w-full grid-cols-3 gap-3.5 overflow-y-auto px-3 pb-3 pr-5 pt-3">
              {meetingTiles.map((p) => (
                <ParticipantCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="relative flex min-h-[56vh] flex-1 items-center justify-center overflow-hidden rounded-[18px] border border-[var(--color-divider)] bg-[var(--color-landing-input-bg)]">
              {sharing && (
                <div className="absolute left-5 top-4 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[var(--color-divider)] bg-[var(--color-surface)] px-2 py-[5px] text-[11px] font-bold text-[var(--color-brand-deep)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                  YOUR SCREEN
                </div>
              )}

              {sharing ? (
                <video ref={screenVideoRef} autoPlay muted className="h-full w-full bg-black object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-[var(--color-landing-input-border)] p-6 text-center text-[var(--color-text-secondary)]">
                  <div className="text-[34px] leading-none">🖥</div>
                  <span>No screen being shared</span>
                  <span className="text-xs text-[var(--color-text-faint)]">Click &quot;Share Screen&quot; below to present</span>
                </div>
              )}

              <div className={`absolute bottom-5 right-5 flex items-center gap-2.5 rounded-2xl border bg-[var(--color-surface-frost-90)] px-3 py-2.5 shadow-[var(--shadow-meeting-self)] backdrop-blur-sm ${
                micOn ? "border-[var(--color-success)]" : "border-[var(--color-divider)]"
              }`}>
                <Avatar initials={currentUser.initials} color={currentUser.color} size={40} />
                <span className="whitespace-nowrap text-xs font-semibold text-[var(--color-text-primary)]">
                  {currentUser.name} (You)
                </span>
              </div>
            </div>
          )}

          <div className="flex h-[110px] shrink-0 items-center gap-2.5 overflow-x-auto border-t border-[var(--color-divider)] bg-[var(--color-surface)] px-3.5 py-2.5">
            {participants.length === 0 ? (
              <span className="w-full text-center text-xs text-[var(--color-text-faint)]">Waiting for others to join...</span>
            ) : (
              participants.map((p) => <ParticipantCard key={p.id} p={p} />)
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 border-t border-[var(--color-divider)] bg-[var(--color-surface)] px-[18px] pb-[18px] pt-[14px]">
            <button
              type="button"
              onClick={toggleMic}
              className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${
                micOn
                  ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                  : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
              }`}
            >
              <span>{micOn ? "🎙" : "🔇"}</span>
              {micOn ? "Mute" : "Unmute"}
            </button>

            <button
              type="button"
              onClick={toggleCam}
              className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${
                camOn
                  ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                  : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
              }`}
            >
              <span>📷</span>
              {camOn ? "Stop Camera" : "Camera"}
            </button>

            <button
              type="button"
              onClick={toggleShare}
              className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${
                sharing
                  ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                  : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
              }`}
            >
              <span>🖥</span>
              {sharing ? "Stop Sharing" : "Share Screen"}
            </button>

            <button
              type="button"
              onClick={() => setShowChat((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${
                showChat
                  ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                  : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
              }`}
            >
              <span>💬</span>
              Chat
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] px-[14px] py-2.5 text-[13px] font-semibold text-[var(--color-text-primary)]"
            >
              <span>...</span>
            </button>

            <button
              type="button"
              onClick={endMeeting}
              className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--color-error)] bg-[var(--color-error-bg)] px-[14px] py-2.5 text-[13px] font-semibold text-[var(--color-error)]"
            >
              📞 End Meeting
            </button>
          </div>
        </div>

        {showChat && (
          <aside className="flex w-[360px] min-w-[300px] max-w-[420px] shrink-0 flex-col border-l border-[var(--color-divider)] bg-[var(--color-surface)]">
            <div className="flex h-[58px] items-center justify-between gap-3 border-b border-[var(--color-divider)] px-4">
              <h3 className="m-0 text-sm font-bold">Live Chat</h3>

              <div className="flex items-center gap-2">
                <div className="grid h-[26px] w-[26px] place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[13px]">
                  👥
                </div>
                <div
                  onClick={() => setShowChat(false)}
                  className="grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[13px]"
                >
                  ✕
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[var(--gradient-meeting-chat)] p-[14px]">
              {messages.map((m) =>
                m.type === "system" ? (
                  <div
                    key={m.id}
                    className="self-center rounded-full border border-[var(--color-divider)] bg-[var(--color-landing-input-bg)] px-2.5 py-1 text-[11px] text-[var(--color-text-faint)]"
                  >
                    {m.text}
                  </div>
                ) : (
                  <div key={m.id} className={`flex max-w-[92%] flex-col gap-1 ${m.isSelf ? "self-end" : "self-start"}`}>
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-faint)]">
                      <span className="font-bold text-[var(--color-text-primary)]">{m.from}</span>
                      {m.isSelf && (
                        <span className="rounded-full bg-[var(--color-brand-xsubtle)] px-1.5 py-[2px] text-[10px] font-bold text-[var(--color-brand-deep)]">
                          You
                        </span>
                      )}
                      <span>{m.time}</span>
                    </div>

                    <div className="break-words rounded-2xl border border-[var(--color-divider)] bg-[var(--color-landing-input-bg)] px-3 py-2.5 text-[13px] leading-[1.45] text-[var(--color-text-primary)]">
                      {m.text}
                    </div>
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[var(--color-divider)] bg-[var(--color-surface)] p-[14px]">
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] px-3 py-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--color-text-primary)] outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="h-[38px] w-[38px] rounded-xl border-none bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-deep))] text-[var(--color-surface)] shadow-[var(--shadow-meeting-send)]"
                >
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
