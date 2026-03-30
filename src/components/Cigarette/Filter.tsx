import { useRef } from "react";

interface FilterProps {
  skin?: "default" | "menthol" | "slim";
  onDoubleClick?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
}

export function Filter({ skin = "default", onDoubleClick, onHoldStart, onHoldEnd }: FilterProps) {
  const holdTimerRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // Start hold detection
    holdTimerRef.current = window.setTimeout(() => {
      isHoldingRef.current = true;
      onHoldStart?.();
    }, 200);
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      onHoldEnd?.();
    }
  };

  const skinColors: Record<string, string> = {
    default: "linear-gradient(to bottom, #e8a862, #dda15e, #d4a574)",
    menthol: "linear-gradient(to bottom, #7ecba1, #5eb88a, #4da67a)",
    slim: "linear-gradient(to bottom, #e8a862, #dda15e, #d4a574)",
  };

  const widthClass = skin === "slim" ? "w-10" : "w-full";

  return (
    <div
      className={`filter-texture h-20 ${widthClass} self-center rounded-b-sm`}
      style={{ background: skinColors[skin] }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={onDoubleClick}
      title="홀드: 연기 뿜기 | 더블클릭: 재떨기"
    />
  );
}
