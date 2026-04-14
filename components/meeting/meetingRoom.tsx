"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
    AlertTriangle,
    Bell,
    Check,
    Copy,
    MessageCircle,
    Mic,
    MicOff,
    Monitor,
    PhoneOff,
    Send,
    Settings,
    Users,
    X,
} from "lucide-react";

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
    accessToken: string | null;
    currentUser: {
        id: number;
        name: string;
        initials: string;
        color: string;
    };
    socketUrl: string;
    onLeave?: () => void;
}

type MeetingViewMode = "grid" | "focus";

interface ServerParticipant {
    userId: number;
    fullName: string;
    role: "HOST" | "PARTICIPANT";
    isMuted: boolean;
    isPresenter: boolean;
    joinedAt: string | Date;
}

interface ServerChatMessage {
    id: string;
    senderId: number;
    senderName: string;
    content: string;
    sentAt: string | Date;
}

type SignalMessage =
    | { type: "offer"; sdp: string }
    | { type: "answer"; sdp: string }
    | { type: "candidate"; candidate: RTCIceCandidateInit };

const MEETING_EVENTS = {
    JOIN: "meeting:join",
    LEAVE: "meeting:leave",
    END: "meeting:end",
    SEND_CHAT: "meeting:chat:send",
    TOGGLE_SELF_MUTE: "meeting:mute:self",
    PRESENTER_ACTION: "meeting:presenter:action",
    WEBRTC_SIGNAL: "meeting:webrtc:signal",
    JOINED: "meeting:joined",
    PARTICIPANT_JOINED: "meeting:participant:joined",
    PARTICIPANT_LEFT: "meeting:participant:left",
    PARTICIPANT_MUTED: "meeting:participant:muted",
    ALL_MUTED: "meeting:all:muted",
    CHAT_MESSAGE: "meeting:chat:message",
    WEBRTC_SIGNAL_RECV: "meeting:webrtc:signal:recv",
    SCREEN_SHARE_STARTED: "meeting:screenshare:started",
    SCREEN_SHARE_STOPPED: "meeting:screenshare:stopped",
    ENDED: "meeting:ended",
    ERROR: "meeting:error",
} as const;

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

function toInitials(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (!parts.length) return "TS";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function colorFromUserId(userId: number) {
    const palette = ["green", "amber", "red", "blue", "violet"];
    return palette[userId % palette.length];
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
            className={`relative flex h-[170px] min-w-[170px] flex-col items-center justify-between gap-3 overflow-hidden rounded-[20px] border bg-[var(--color-landing-input-bg)] p-3 ${p.speaking
                    ? "border-[var(--color-success)] shadow-[0_0_0_1px_var(--color-success)]"
                    : "border-[var(--color-landing-input-border)]"
                }`}
        >
            {p.stream ? (
                <video ref={videoRef} autoPlay muted className="h-full w-full rounded-[16px] object-cover" />
            ) : (
                <div className="flex flex-1 items-center justify-center">
                    <Avatar initials={p.initials} color={p.color} size={40} />
                </div>
            )}

            <span
                className={`max-w-[140px] truncate text-[12px] font-semibold ${p.stream
                        ? "absolute bottom-3 left-3 rounded-full bg-[var(--color-overlay-dark)] px-2.5 py-1 text-[var(--color-surface)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
            >
                {p.name}
            </span>

            <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${p.stream ? "absolute right-3 top-3" : ""
                    } ${p.micOn ? "bg-[var(--color-meeting-mic-on-bg)] text-[var(--color-meeting-mic-on-text)]" : "bg-[var(--color-error-bg)] text-[var(--color-error)]"}`}
            >
                {p.micOn ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
            </span>
        </div>
    );
}

export default function MeetingRoom({ meetingId, accessToken, currentUser, socketUrl, onLeave }: MeetingRoomProps) {
    const ASSUME_MIC_AVAILABLE_FOR_NOW = true;

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [micOn, setMicOn] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [rightPanelMode, setRightPanelMode] = useState<"chat" | "participants">("chat");
    const [viewMode, setViewMode] = useState<MeetingViewMode>("grid");
    const [elapsed, setElapsed] = useState(0);
    const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
    const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
    const [focusedSharerId, setFocusedSharerId] = useState<number | null>(null);
    const [focusedSharerName, setFocusedSharerName] = useState<string>("");

    const meetingTiles: Participant[] = [
        {
            id: String(currentUser.id),
            name: `${currentUser.name} (You)`,
            initials: currentUser.initials,
            color: currentUser.color,
            micOn,
            speaking: false,
        },
        ...participants,
    ];

    const socketRef = useRef<Socket | null>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const focusVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const peerConnectionsRef = useRef<Map<number, RTCPeerConnection>>(new Map());
    const participantsRef = useRef<Participant[]>([]);
    const sharingRef = useRef(false);
    const focusedSharerIdRef = useRef<number | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const addSystemMsg = (text: string) => {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), type: "system", text, time: formatTime() }]);
    };

    useEffect(() => {
        participantsRef.current = participants;
    }, [participants]);

    useEffect(() => {
        sharingRef.current = sharing;
    }, [sharing]);

    useEffect(() => {
        focusedSharerIdRef.current = focusedSharerId;
    }, [focusedSharerId]);

    const focusedParticipant =
        focusedSharerId === null ? undefined : participants.find((p) => Number(p.id) === focusedSharerId);

    const focusedStream =
        focusedSharerId === currentUser.id ? screenStreamRef.current : focusedParticipant?.stream;

    const focusedHasLiveVideo = Boolean(
        focusedStream?.getVideoTracks().some((track) => track.readyState === "live")
    );

    useEffect(() => {
        const videoEl = focusVideoRef.current;
        if (!videoEl) return;

        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.srcObject = focusedStream ?? null;

        if (!focusedStream) return;

        const tryPlay = () => {
            void videoEl.play().catch(() => {
                // Browser autoplay policy may reject; user interaction can resume playback.
            });
        };

        if (videoEl.readyState >= 1) {
            tryPlay();
            return;
        }

        videoEl.onloadedmetadata = () => {
            tryPlay();
            videoEl.onloadedmetadata = null;
        };

        videoEl.oncanplay = () => {
            tryPlay();
            videoEl.oncanplay = null;
        };
    }, [focusedStream]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ["websocket"],
        });
        socketRef.current = socket;

        const mapParticipant = (p: ServerParticipant): Participant => {
            const isSelf = p.userId === currentUser.id;
            return {
                id: String(p.userId),
                name: isSelf ? `${p.fullName} (You)` : p.fullName,
                initials: isSelf ? currentUser.initials : toInitials(p.fullName),
                color: isSelf ? currentUser.color : colorFromUserId(p.userId),
                micOn: !p.isMuted,
                speaking: false,
            };
        };

        socket.on("connect", () => {
            setWsStatus("connected");
            socket.emit(MEETING_EVENTS.JOIN, { meetingId, token: accessToken });
        });

        socket.on("disconnect", () => setWsStatus("disconnected"));
        socket.on("connect_error", () => setWsStatus("disconnected"));

        socket.on(MEETING_EVENTS.ERROR, (payload: { message: string }) => {
            addSystemMsg(payload.message);
        });

        socket.on(MEETING_EVENTS.JOINED, (payload: {
            you: ServerParticipant;
            participants: ServerParticipant[];
            chatHistory: ServerChatMessage[];
        }) => {
            setMicOn(!payload.you.isMuted);
            setParticipants(payload.participants.filter((p) => p.userId !== currentUser.id).map(mapParticipant));
            setMessages(
                payload.chatHistory.map((msg) => ({
                    id: msg.id,
                    type: "message",
                    from: msg.senderName,
                    fromId: String(msg.senderId),
                    text: msg.content,
                    time: formatTime(new Date(msg.sentAt)),
                    isSelf: msg.senderId === currentUser.id,
                }))
            );
        });

        socket.on(MEETING_EVENTS.PARTICIPANT_JOINED, (payload: { participant: ServerParticipant }) => {
            const mapped = mapParticipant(payload.participant);
            setParticipants((prev) => (prev.find((x) => x.id === mapped.id) ? prev : [...prev, mapped]));
            addSystemMsg(`${payload.participant.fullName} joined`);

            if (sharingRef.current && payload.participant.userId !== currentUser.id) {
                void sendOfferToParticipant(payload.participant.userId);
            }
        });

        socket.on(MEETING_EVENTS.PARTICIPANT_LEFT, (payload: { userId: number; fullName: string }) => {
            const id = String(payload.userId);
            setParticipants((prev) => prev.filter((p) => p.id !== id));
            closePeerConnection(payload.userId);
            if (focusedSharerIdRef.current === payload.userId) {
                setFocusedSharerId(null);
                setFocusedSharerName("");
            }
            addSystemMsg(`${payload.fullName} left`);
        });

        socket.on(MEETING_EVENTS.WEBRTC_SIGNAL_RECV, (payload: { fromUserId: number; signal: SignalMessage }) => {
            void (async () => {
                const { fromUserId, signal } = payload;
                const pc = getOrCreatePeerConnection(fromUserId);

                if (signal.type === "offer") {
                    await pc.setRemoteDescription(new RTCSessionDescription({
                        type: "offer",
                        sdp: signal.sdp,
                    }));

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    if (answer.sdp) {
                        sendWebRtcSignal(fromUserId, {
                            type: "answer",
                            sdp: answer.sdp,
                        });
                    }
                    return;
                }

                if (signal.type === "answer") {
                    await pc.setRemoteDescription(new RTCSessionDescription({
                        type: "answer",
                        sdp: signal.sdp,
                    }));
                    return;
                }

                if (signal.type === "candidate") {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                }
            })().catch(() => {
                addSystemMsg("WebRTC signaling error.");
            });
        });

        socket.on(MEETING_EVENTS.CHAT_MESSAGE, (payload: { message: ServerChatMessage }) => {
            const msg = payload.message;
            setMessages((prev) => [
                ...prev,
                {
                    id: msg.id,
                    type: "message",
                    from: msg.senderName,
                    fromId: String(msg.senderId),
                    text: msg.content,
                    time: formatTime(new Date(msg.sentAt)),
                    isSelf: msg.senderId === currentUser.id,
                },
            ]);
        });

        socket.on(MEETING_EVENTS.PARTICIPANT_MUTED, (payload: { userId: number; isMuted: boolean }) => {
            const id = String(payload.userId);
            setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, micOn: !payload.isMuted } : p)));
            if (payload.userId === currentUser.id) {
                setMicOn(!payload.isMuted);
            }
        });

        socket.on(MEETING_EVENTS.ALL_MUTED, (payload: { mutedUserIds: number[] }) => {
            const mutedSet = new Set(payload.mutedUserIds.map(String));
            setParticipants((prev) => prev.map((p) => (mutedSet.has(p.id) ? { ...p, micOn: false } : p)));
            if (mutedSet.has(String(currentUser.id))) {
                setMicOn(false);
            }
        });

        socket.on(MEETING_EVENTS.SCREEN_SHARE_STARTED, (payload: { screenShareUserName?: string; screenShareUserId?: number }) => {
            if (typeof payload.screenShareUserId === "number") {
                setFocusedSharerId(payload.screenShareUserId);
                setFocusedSharerName(payload.screenShareUserName ?? "");
            }
            addSystemMsg(`${payload.screenShareUserName ?? "Someone"} started sharing screen`);
        });

        socket.on(MEETING_EVENTS.SCREEN_SHARE_STOPPED, (payload: { stoppedByUserId?: number }) => {
            if (typeof payload.stoppedByUserId === "number") {
                const id = String(payload.stoppedByUserId);
                setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, stream: undefined } : p)));
                closePeerConnection(payload.stoppedByUserId);
                if (focusedSharerIdRef.current === payload.stoppedByUserId) {
                    setFocusedSharerId(null);
                    setFocusedSharerName("");
                }
            }
            addSystemMsg("Screen sharing stopped");
        });

        socket.on(MEETING_EVENTS.ENDED, () => {
            addSystemMsg("Meeting ended.");
            onLeave?.();
        });

        return () => {
            socket.emit(MEETING_EVENTS.LEAVE);
            socket.disconnect();
            closeAllPeerConnections();
        };
    }, [accessToken, currentUser.color, currentUser.id, currentUser.initials, meetingId, onLeave, socketUrl]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function emitSocket(event: string, payload?: object) {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, payload);
        }
    }

    function sendWebRtcSignal(targetUserId: number, signal: SignalMessage) {
        emitSocket(MEETING_EVENTS.WEBRTC_SIGNAL, {
            meetingId,
            targetUserId,
            signal,
        });
    }

    function closePeerConnection(targetUserId: number) {
        const pc = peerConnectionsRef.current.get(targetUserId);
        if (!pc) return;

        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.close();
        peerConnectionsRef.current.delete(targetUserId);
    }

    function closeAllPeerConnections() {
        peerConnectionsRef.current.forEach((_, userId) => closePeerConnection(userId));
    }

    function getOrCreatePeerConnection(targetUserId: number): RTCPeerConnection {
        const existing = peerConnectionsRef.current.get(targetUserId);
        if (existing) return existing;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            sendWebRtcSignal(targetUserId, {
                type: "candidate",
                candidate: event.candidate.toJSON(),
            });
        };

        pc.ontrack = (event) => {
            const [stream] = event.streams;
            if (!stream) return;

            const id = String(targetUserId);
            setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, stream } : p)));
        };

        peerConnectionsRef.current.set(targetUserId, pc);
        return pc;
    }

    function attachScreenTrack(pc: RTCPeerConnection, stream: MediaStream) {
        const [videoTrack] = stream.getVideoTracks();
        if (!videoTrack) return;

        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
            void sender.replaceTrack(videoTrack);
            return;
        }

        pc.addTrack(videoTrack, stream);
    }

    async function sendOfferToParticipant(targetUserId: number) {
        const stream = screenStreamRef.current;
        if (!stream) return;

        const pc = getOrCreatePeerConnection(targetUserId);
        attachScreenTrack(pc, stream);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        if (offer.sdp) {
            sendWebRtcSignal(targetUserId, {
                type: "offer",
                sdp: offer.sdp,
            });
        }
    }

    async function toggleMic() {
        // Muting should not request permissions; only disable existing tracks.
        if (micOn) {
            localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
            setMicOn(false);
            emitSocket(MEETING_EVENTS.TOGGLE_SELF_MUTE);
            return;
        }

        if (!localStreamRef.current) {
            try {
                localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                if (ASSUME_MIC_AVAILABLE_FOR_NOW) {
                    setMicOn(true);
                    emitSocket(MEETING_EVENTS.TOGGLE_SELF_MUTE);
                    addSystemMsg("Microphone running in demo mode (no real audio input).");
                    return;
                }

                const err = error as DOMException;
                if (err.name === "NotAllowedError") {
                    alert("Microphone permission is blocked. Allow microphone access in your browser site settings.");
                } else if (err.name === "NotFoundError") {
                    alert("No microphone was found. Please connect a microphone and try again.");
                } else if (err.name === "NotReadableError") {
                    alert("Your microphone is busy in another app. Close that app and try again.");
                } else {
                    alert("Unable to access microphone. Please check browser and system permissions.");
                }
                return;
            }
        }

        localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
        setMicOn(true);
        emitSocket(MEETING_EVENTS.TOGGLE_SELF_MUTE);
    }

    async function toggleShare() {
        if (sharing) {
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
            if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
            closeAllPeerConnections();
            setSharing(false);
            if (focusedSharerIdRef.current === currentUser.id) {
                setFocusedSharerId(null);
                setFocusedSharerName("");
            }
            emitSocket(MEETING_EVENTS.PRESENTER_ACTION, { meetingId, action: "stop" });
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 }, audio: false });
            screenStreamRef.current = stream;

            if (screenVideoRef.current) {
                screenVideoRef.current.srcObject = stream;
                screenVideoRef.current.play().catch(() => { });
            }

            stream.getVideoTracks()[0].onended = () => {
                setSharing(false);
                screenStreamRef.current = null;
                if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
                closeAllPeerConnections();
                if (focusedSharerIdRef.current === currentUser.id) {
                    setFocusedSharerId(null);
                    setFocusedSharerName("");
                }
                emitSocket(MEETING_EVENTS.PRESENTER_ACTION, { meetingId, action: "stop" });
            };

            setSharing(true);
            setFocusedSharerId(currentUser.id);
            setFocusedSharerName(`${currentUser.name} (You)`);
            emitSocket(MEETING_EVENTS.PRESENTER_ACTION, { meetingId, action: "start" });

            const others = participantsRef.current
                .map((p) => Number(p.id))
                .filter((id) => !Number.isNaN(id) && id !== currentUser.id);

            for (const userId of others) {
                await sendOfferToParticipant(userId);
            }
        } catch (err) {
            console.warn("Screen share cancelled", err);
        }
    }

    function sendMessage() {
        const text = chatInput.trim();
        if (!text) return;
        emitSocket(MEETING_EVENTS.SEND_CHAT, { meetingId, content: text });
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
            emitSocket(MEETING_EVENTS.END);
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            closeAllPeerConnections();
            onLeave?.();
        }
    }

    async function copyMeetingLink() {
        const meetingLink = `${window.location.origin}/meeting/${meetingId}`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(meetingLink);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = meetingLink;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                const copied = document.execCommand("copy");
                document.body.removeChild(textarea);

                if (!copied) {
                    throw new Error("Copy command was not successful.");
                }
            }

            setCopyState("success");
        } catch {
            setCopyState("error");
        }

        window.setTimeout(() => setCopyState("idle"), 2200);
    }

    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-bg-dashboard)] font-[var(--font-base)] text-[var(--color-text-primary)]">
            <nav className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[var(--color-divider)] bg-[var(--color-surface)] px-5 shadow-[0_8px_24px_rgba(100,80,160,0.04)]">
                <div className="flex items-center whitespace-nowrap text-[15px] font-bold">
                    Team<span className="ml-px text-[var(--color-brand)]">Sync</span>
                    <span className="ml-6 rounded-full bg-[var(--color-brand-xsubtle)] px-3 py-1 text-sm font-medium text-[var(--color-brand-deep)]">
                        {currentUser.name}
                    </span>
                </div>

                <div className="inline-flex gap-1.5 rounded-xl border border-[var(--color-landing-input-border)] bg-[var(--color-landing-input-bg)] p-1">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${viewMode === "grid"
                                ? "bg-[var(--color-surface)] text-[var(--color-brand-deep)] shadow-[var(--shadow-meeting-toggle-active)]"
                                : "text-[var(--color-text-secondary)]"
                            }`}
                    >
                        Grid
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("focus")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${viewMode === "focus"
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

                    <button
                        type="button"
                        onClick={copyMeetingLink}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${copyState === "success"
                                ? "border-[var(--color-success)] bg-[var(--color-success-bg)] text-[var(--color-success)]"
                                : copyState === "error"
                                    ? "border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)]"
                                    : "border-[var(--color-landing-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-secondary)]"
                            }`}
                        title="Copy meeting link"
                    >
                        {copyState === "success" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copyState === "success" ? "Copied" : copyState === "error" ? "Retry" : "Copy Link"}
                    </button>

                    {wsStatus === "disconnected" && (
                        <span className="rounded-md bg-[var(--color-status-warn-bg)] px-2 py-[3px] text-[11px] font-semibold text-[var(--color-warn)]">
                            <span className="inline-flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Reconnecting...
                            </span>
                        </span>
                    )}
                    <Avatar initials={currentUser.initials} color={currentUser.color} size={32} />
                </div>
            </nav>

            <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-4 lg:p-5">
                    {viewMode === "grid" ? (
                        <section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-[var(--color-divider)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-db-card)]">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">Users</p>
                                    <h2 className="mt-1 text-[18px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
                                        Active participants
                                    </h2>
                                </div>
                                <div className="rounded-full bg-[var(--color-brand-xsubtle)] px-3 py-1 text-[12px] font-semibold text-[var(--color-brand-deep)]">
                                    {meetingTiles.length} online
                                </div>
                            </div>

                            <div className="grid min-h-0 flex-1 auto-rows-[170px] grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4 overflow-y-auto pr-2">
                                {meetingTiles.map((p) => (
                                    <ParticipantCard key={p.id} p={p} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <div className="relative flex min-h-[62vh] flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-[var(--color-divider)] bg-[var(--color-landing-input-bg)] shadow-[var(--shadow-db-card)]">
                            {focusedSharerId !== null && (
                                <div className="absolute left-5 top-4 z-[2] inline-flex items-center gap-1.5 rounded-full border border-[var(--color-divider)] bg-[var(--color-surface)] px-2 py-[5px] text-[11px] font-bold text-[var(--color-brand-deep)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                                    {focusedSharerId === currentUser.id
                                        ? "YOUR SCREEN"
                                        : `${focusedSharerName || focusedParticipant?.name || "Participant"} SCREEN`}
                                </div>
                            )}

                            {focusedSharerId !== null ? (
                                focusedHasLiveVideo ? (
                                    <video
                                        key={`${focusedSharerId ?? "none"}-${focusedStream?.id ?? "no-stream"}`}
                                        ref={focusVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className="h-full w-full bg-black object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-[var(--color-landing-input-border)] p-6 text-center text-[var(--color-text-secondary)]">
                                        <Monitor className="h-9 w-9" />
                                        <span>{focusedSharerName || focusedParticipant?.name || "Participant"} is sharing...</span>
                                        <span className="text-xs text-[var(--color-text-faint)]">Waiting for stream to connect</span>
                                    </div>
                                )
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-[var(--color-landing-input-border)] p-6 text-center text-[var(--color-text-secondary)]">
                                    <Monitor className="h-9 w-9" />
                                    <span>No screen being shared</span>
                                    <span className="text-xs text-[var(--color-text-faint)]">Click &quot;Share Screen&quot; below to present</span>
                                </div>
                            )}

                            <div className={`absolute bottom-5 right-5 flex items-center gap-2.5 rounded-2xl border bg-[var(--color-surface-frost-90)] px-3 py-2.5 shadow-[var(--shadow-meeting-self)] backdrop-blur-sm ${micOn ? "border-[var(--color-success)]" : "border-[var(--color-divider)]"
                                }`}>
                                <Avatar initials={currentUser.initials} color={currentUser.color} size={40} />
                                <span className="whitespace-nowrap text-xs font-semibold text-[var(--color-text-primary)]">
                                    {currentUser.name} (You)
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-wrap justify-center gap-2.5 border-t border-[var(--color-divider)] bg-[var(--color-surface)] px-[18px] pb-[18px] pt-[14px] shadow-[0_-8px_24px_rgba(100,80,160,0.03)]">
                        <button
                            type="button"
                            onClick={toggleMic}
                            className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${micOn
                                    ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                                    : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
                                }`}
                        >
                            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                            {micOn ? "Mute" : "Unmute"}
                        </button>
                        <button
                            type="button"
                            onClick={toggleShare}
                            className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${sharing
                                    ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                                    : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
                                }`}
                        >
                            <Monitor className="h-4 w-4" />
                            {sharing ? "Stop Sharing" : "Share Screen"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (showChat && rightPanelMode === "chat") {
                                    setShowChat(false);
                                } else {
                                    setShowChat(true);
                                    setRightPanelMode("chat");
                                }
                            }}
                            className={`inline-flex items-center gap-2 rounded-[14px] border px-[14px] py-2.5 text-[13px] font-semibold ${showChat && rightPanelMode === "chat"
                                    ? "border-[var(--color-brand-light)] bg-[var(--color-brand-xsubtle)] text-[var(--color-brand-deep)]"
                                    : "border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[var(--color-text-primary)]"
                                }`}
                        >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                        </button>
                        <button
                            type="button"
                            onClick={endMeeting}
                            className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--color-error)] bg-[var(--color-error-bg)] px-[14px] py-2.5 text-[13px] font-semibold text-[var(--color-error)]"
                        >
                            <PhoneOff className="h-4 w-4" /> End Meeting
                        </button>
                    </div>
                </div>

                {showChat && (
                    <aside className="flex w-[380px] min-w-[320px] max-w-[440px] shrink-0 flex-col border-l border-[var(--color-divider)] bg-[var(--color-surface)] shadow-[-12px_0_24px_rgba(100,80,160,0.03)]">
                        <div className="flex h-[58px] items-center justify-between gap-3 border-b border-[var(--color-divider)] px-4">
                            <h3 className="m-0 text-sm font-bold">{rightPanelMode === "chat" ? "Live Chat" : "Participants"}</h3>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowChat(true);
                                        setRightPanelMode("chat");
                                    }}
                                    className="grid h-[26px] w-[26px] place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[13px]"
                                    title="Show chat panel"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowChat(true);
                                        setRightPanelMode("participants");
                                    }}
                                    className="grid h-[26px] w-[26px] place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[13px]"
                                    title="Show participants panel"
                                >
                                    <Users className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowChat(false)}
                                    className="grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-full border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] text-[13px]"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {rightPanelMode === "participants" ? (
                            <div className="flex flex-1 flex-col overflow-hidden bg-[var(--gradient-meeting-chat)] p-[14px]">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[var(--color-text-secondary)]">All participants</p>
                                    <span className="rounded-full bg-[var(--color-brand-xsubtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand-deep)]">
                                        {meetingTiles.length}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-1.5 overflow-y-auto rounded-xl border border-[var(--color-input-border)] bg-[var(--color-landing-input-bg)] p-2">
                                    {meetingTiles.map((participant) => (
                                        <div
                                            key={`participant-list-${participant.id}`}
                                            className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5"
                                        >
                                            <div className="flex min-w-0 items-center gap-2">
                                                <Avatar initials={participant.initials} color={participant.color} size={32} />
                                                <span className="truncate text-xs font-medium text-[var(--color-text-primary)]">
                                                    {participant.name}
                                                </span>
                                            </div>
                                            {participant.micOn ? (
                                                <Mic className="h-3.5 w-3.5 text-[var(--color-success)]" />
                                            ) : (
                                                <MicOff className="h-3.5 w-3.5 text-[var(--color-error)]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
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
                                            <span className="grid place-items-center">
                                                <Send className="h-4 w-4" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </aside>
                )}
            </div>
        </div>
    );
}
