"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Link, List, Paperclip, Send } from "lucide-react";

interface Props {
  orgName: string;
  onSend: (content: string, files?: File[]) => void;
}

export default function OrgChatInput({ orgName, onSend }: Props) {
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!text.trim() && pendingFiles.length === 0) return;
    onSend(text.trim(), pendingFiles.length > 0 ? pendingFiles : undefined);
    setText("");
    setPendingFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <footer
      className="px-8 py-5 shrink-0"
      style={{ background: "var(--color-surface, #faf8ff)" }}
    >
      <div
        className="rounded-2xl p-2 flex flex-col gap-1"
        style={{
          background: "var(--color-surface-container-lowest, #fff)",
          border: "1px solid var(--color-divider, #e0e2f0)",
          boxShadow: "0 4px 24px rgba(47,50,61,0.06)",
        }}
      >
        {/* Formatting toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1">
          {[
            { icon: Bold, label: "Bold" },
            { icon: Italic, label: "Italic" },
            { icon: Link, label: "Link" },
            { icon: List, label: "List" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              title={label}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--color-text-muted, #777a87)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "var(--color-surface-container, #ecedf9)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* Pending files */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-2">
            {pendingFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium"
                style={{
                  background: "var(--color-brand-subtle, #ede9f8)",
                  color: "var(--color-brand, #6e49b6)",
                }}
              >
                <Paperclip size={11} />
                <span className="max-w-[140px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(i)}
                  className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-2 px-2 pb-1">
          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl transition-colors shrink-0"
            style={{
              background: "var(--color-surface-container-low, #f3f3fd)",
              color: "var(--color-brand, #6e49b6)",
            }}
            title="Attach file"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "var(--color-surface-container, #ecedf9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "var(--color-surface-container-low, #f3f3fd)")
            }
          >
            <Paperclip size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${orgName.toLowerCase().replace(/\s+/g, "-")}`}
            rows={1}
            className="flex-1 resize-none py-2.5 px-1 text-[13.5px] outline-none bg-transparent leading-relaxed min-h-[44px] max-h-32"
            style={{
              color: "var(--color-text-primary, #2f323d)",
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 128) + "px";
            }}
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!text.trim() && pendingFiles.length === 0}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 disabled:opacity-40 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-brand, #6e49b6), var(--color-brand-deep, #4a2d8c))",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(110,73,182,0.3)",
            }}
            title="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}