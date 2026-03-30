import { useState, useEffect, useRef, useCallback } from "react";

export interface SmokeParticle {
  id: number;
  x: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  drift: number;
  wobble: number;    // horizontal sine wobble amplitude
  wobbleSpeed: number;
  scaleEnd: number;  // final scale multiplier
  r: number;
  g: number;
  b: number;
}

export function useSmokeParticles(isActive: boolean, amount: string) {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const idRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const counts: Record<string, number> = { none: 0, low: 4, normal: 8, high: 14 };
  const maxParticles = counts[amount] || 8;
  const spawnInterval = amount === "high" ? 600 : amount === "low" ? 2000 : 1000;

  const createParticle = useCallback((): SmokeParticle => {
    idRef.current += 1;
    return {
      id: idRef.current,
      x: 12 + Math.random() * 32,
      size: 10 + Math.random() * 30,
      opacity: 0.06 + Math.random() * 0.18,
      delay: Math.random() * 0.3,
      duration: 3 + Math.random() * 5,
      drift: (Math.random() - 0.5) * 50,
      wobble: 5 + Math.random() * 20,
      wobbleSpeed: 1 + Math.random() * 3,
      scaleEnd: 1.5 + Math.random() * 2,
      r: 180 + Math.floor(Math.random() * 75),
      g: 180 + Math.floor(Math.random() * 75),
      b: 180 + Math.floor(Math.random() * 75),
    };
  }, []);

  useEffect(() => {
    if (!isActive || amount === "none") {
      setParticles([]);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Initial burst
    const initial: SmokeParticle[] = [];
    for (let i = 0; i < Math.min(4, maxParticles); i++) {
      initial.push(createParticle());
    }
    setParticles(initial);

    intervalRef.current = window.setInterval(() => {
      // Spawn 1-3 particles at a time for more dynamic feel
      const batchSize = amount === "high" ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
      setParticles(prev => {
        const newParticles = [];
        for (let i = 0; i < batchSize; i++) {
          newParticles.push(createParticle());
        }
        const trimmed = prev.length >= maxParticles ? prev.slice(batchSize) : prev;
        return [...trimmed, ...newParticles];
      });
    }, spawnInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, amount, maxParticles, spawnInterval, createParticle]);

  return particles;
}
