interface AshProps {
  height: number;
}

export function Ash({ height }: AshProps) {
  if (height <= 0) return null;

  // 재가 쌓일수록 끝부분이 불규칙해지고 갈라지는 느낌
  const crackOpacity = Math.min(height / 60, 1);

  return (
    <div
      className="w-full relative transition-all duration-500"
      style={{
        height: `${height}px`,
        willChange: "height",
      }}
    >
      {/* Base ash gradient */}
      <div
        className="absolute inset-0 rounded-t-[30px]"
        style={{
          background: `linear-gradient(to bottom,
            #2a2a2a 0%,
            #3d3d3d 20%,
            #555555 50%,
            #777777 75%,
            #999999 100%)`,
        }}
      />

      {/* 재 표면 질감 — 미세한 균열 */}
      <div
        className="absolute inset-0 rounded-t-[30px]"
        style={{
          opacity: crackOpacity,
          background: `
            repeating-linear-gradient(
              ${45 + Math.floor(height * 3) % 30}deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.15) 3px,
              rgba(0,0,0,0.15) 4px
            )
          `,
        }}
      />

      {/* 재 끝부분 — 불규칙한 테두리 느낌 */}
      {height > 15 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, #999 0%, #aaa 30%, #888 60%, #aaa 100%)",
            opacity: 0.5,
          }}
        />
      )}

      {/* 약간의 빛 반사 (재 표면의 광택) */}
      <div
        className="absolute inset-0 rounded-t-[30px]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
