interface TimerDisplayProps {
  display: string;
  state: string;
  isBurning?: boolean; // 홀드 중 빨리 타는 상태
}

export function TimerDisplay({ display, state, isBurning = false }: TimerDisplayProps) {
  const stateLabel: Record<string, string> = {
    idle: "준비",
    running: "집중 중",
    paused: "일시정지",
    break: "휴식",
    longBreak: "긴 휴식",
  };

  return (
    <div className="flex flex-col items-center mt-1 select-none">
      <span
        className={`font-mono text-[10px] tracking-wider transition-all duration-200 ${
          isBurning
            ? "text-orange-400 scale-110 timer-burning"
            : "text-gray-400"
        }`}
      >
        {display}
      </span>
      <span className={`text-[8px] transition-colors ${
        isBurning ? "text-orange-600" : "text-gray-600"
      }`}>
        {isBurning ? "깊게 흡입 중..." : (stateLabel[state] || "")}
      </span>
    </div>
  );
}
