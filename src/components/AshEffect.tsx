import { useState, useCallback } from "react";

interface AshParticle {
  id: number;
  tx: number;
  ty: number;
  r: number;
  s: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export function useAshEffect() {
  const [particles, setParticles] = useState<AshParticle[]>([]);

  const triggerFlick = useCallback((ashHeight: number) => {
    const newParticles: AshParticle[] = [];
    const count = 20 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const gray = 90 + Math.floor(Math.random() * 90);
      // 파편이 재 영역 전체에서 떨어짐
      newParticles.push({
        id: Date.now() + i,
        tx: (Math.random() - 0.5) * 140,           // 좌우 넓게 흩어짐
        ty: 40 + Math.random() * 150,                // 아래로 떨어짐 (중력)
        r: (Math.random() - 0.5) * 1080,             // 빠르게 회전
        s: 0.1 + Math.random() * 0.3,
        width: 2 + Math.random() * 5,
        height: 1 + Math.random() * 3,               // 납작한 재 조각
        x: 2 + Math.random() * 52,                   // 담배 너비 안에서
        y: Math.random() * Math.min(ashHeight, 60),   // 재 높이 범위 안에서
        color: `rgb(${gray}, ${gray - 15}, ${gray - 25})`,
        delay: Math.random() * 0.2,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  }, []);

  return { particles, triggerFlick };
}

export function AshEffect({ particles }: { particles: AshParticle[] }) {
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="ash-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            background: p.color,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            "--r": `${p.r}deg`,
            "--s": `${p.s}`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
