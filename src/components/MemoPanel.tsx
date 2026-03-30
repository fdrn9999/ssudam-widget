import { useState, useEffect, useRef, useCallback } from "react";
import { MemoData, loadMemos, saveMemos } from "../stores/settingsStore";

interface MemoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemoPanel({ isOpen, onClose }: MemoPanelProps) {
  const [memos, setMemos] = useState<MemoData[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    loadMemos().then(setMemos);
  }, []);

  const autoSave = useCallback(async (updatedMemos: MemoData[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("...");
    saveTimerRef.current = window.setTimeout(async () => {
      await saveMemos(updatedMemos);
      setSaveStatus("저장됨 ✓");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1000);
  }, []);

  const updateMemo = (field: "title" | "content", value: string) => {
    const updated = memos.map((m, i) =>
      i === activeTab ? { ...m, [field]: value, updatedAt: new Date().toISOString() } : m
    );
    setMemos(updated);
    autoSave(updated);
  };

  const addMemo = () => {
    if (memos.length >= 5) return;
    const newMemo: MemoData = {
      id: Date.now(),
      title: "메모",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    const updated = [...memos, newMemo];
    setMemos(updated);
    setActiveTab(updated.length - 1);
    saveMemos(updated);
  };

  const deleteMemo = (idx: number) => {
    if (memos.length <= 1) return;
    const updated = memos.filter((_, i) => i !== idx);
    setMemos(updated);
    setActiveTab(Math.min(activeTab, updated.length - 1));
    saveMemos(updated);
  };

  if (!isOpen) return null;

  const current = memos[activeTab];
  if (!current) return null;

  return (
    <div
      className="memo-slide-in w-60 h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #1c1915 0%, #1a1714 50%, #17140f 100%)",
        borderRight: "1px solid rgba(232,168,98,0.1)",
      }}
    >
      {/* 담배갑 뚜껑 안쪽 느낌 — 제목 */}
      <div
        className="px-3 py-2.5 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-800">✎</span>
          <input
            className="bg-transparent text-gray-300 text-xs font-medium w-28 outline-none placeholder-gray-700"
            value={current.title}
            onChange={e => updateMemo("title", e.target.value)}
            placeholder="제목..."
          />
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 본문 — 손글씨 느낌 */}
      <div className="flex-1 relative">
        <textarea
          className="w-full h-full bg-transparent text-gray-300 text-[11px] leading-relaxed p-3 resize-none outline-none placeholder-gray-700"
          style={{
            fontFamily: "'Nanum Pen Script', 'Malgun Gothic', cursive",
            backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(255,255,255,0.03) 23px, rgba(255,255,255,0.03) 24px)",
            backgroundPositionY: "3px",
          }}
          placeholder="담배갑 뚜껑 안쪽에 적듯이..."
          value={current.content}
          onChange={e => updateMemo("content", e.target.value)}
        />
      </div>

      {/* 하단 바 */}
      <div
        className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[8px] text-gray-700 font-mono">
          {current.content.length}자
          {saveStatus && <span className="text-amber-800 ml-1.5">{saveStatus}</span>}
        </span>
      </div>

      {/* 메모 탭 — 담배갑 안 담배 개비처럼 */}
      <div
        className="flex items-center gap-0.5 px-2 py-1.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {memos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            onDoubleClick={() => deleteMemo(i)}
            className={`flex-1 h-5 rounded-sm transition-all ${
              i === activeTab
                ? "bg-amber-700/30 border border-amber-700/40"
                : "bg-gray-800/30 hover:bg-gray-700/30"
            }`}
            title={i === activeTab ? `메모 ${i + 1}` : "더블클릭: 삭제"}
          >
            <div className={`w-1 h-2.5 mx-auto rounded-sm ${
              i === activeTab ? "bg-amber-600" : "bg-gray-600"
            }`} />
          </button>
        ))}
        {memos.length < 5 && (
          <button
            onClick={addMemo}
            className="w-5 h-5 rounded-sm text-[10px] text-gray-600 hover:text-amber-600 hover:bg-amber-900/20 transition-all flex items-center justify-center"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
