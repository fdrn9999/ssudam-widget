import { useState, useRef, useCallback, useEffect } from "react";

export type TimerMode = "pomodoro" | "free" | "infinite";
export type TimerState = "idle" | "running" | "paused" | "break" | "longBreak";

interface TimerConfig {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  mode: TimerMode;
  onSessionComplete?: () => void;
  onBreakComplete?: () => void;
}

export function useTimer(config: TimerConfig) {
  const [state, setState] = useState<TimerState>("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(config.workMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState(config.workMinutes * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const stateRef = useRef<TimerState>(state);
  const configRef = useRef(config);
  const burnRateRef = useRef(1); // 1 = normal, 3 = holding (빨리 탐)

  // Keep refs in sync
  stateRef.current = state;
  configRef.current = config;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;

  const startBreak = useCallback((isLong: boolean) => {
    clearTimer();
    const secs = (isLong ? configRef.current.longBreakMinutes : configRef.current.breakMinutes) * 60;
    setRemainingSeconds(secs);
    setTotalSeconds(secs);
    setState(isLong ? "longBreak" : "break");
  }, [clearTimer]);

  const start = useCallback(() => {
    const currentState = stateRef.current;
    if (currentState === "idle") {
      const secs = configRef.current.mode === "infinite" ? 3600 : configRef.current.workMinutes * 60;
      setRemainingSeconds(secs);
      setTotalSeconds(secs);
      setState("running");
    } else if (currentState === "paused") {
      setState("running");
    }
  }, []);

  const pause = useCallback(() => {
    if (stateRef.current === "running") {
      setState("paused");
      clearTimer();
    }
  }, [clearTimer]);

  const toggle = useCallback(() => {
    if (stateRef.current === "running") pause();
    else start();
  }, [start, pause]);

  const reset = useCallback(() => {
    clearTimer();
    const secs = configRef.current.mode === "infinite" ? 3600 : configRef.current.workMinutes * 60;
    setRemainingSeconds(secs);
    setTotalSeconds(secs);
    setState("idle");
    setStreak(0);
  }, [clearTimer]);

  // Main timer effect - only depends on state
  useEffect(() => {
    if (state !== "running" && state !== "break" && state !== "longBreak") {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          const currentState = stateRef.current;
          const cfg = configRef.current;

          if (currentState === "running") {
            setStreak(s => s + 1);
            cfg.onSessionComplete?.();

            if (cfg.mode === "pomodoro") {
              clearTimer();
              setSessionCount(c => {
                const next = c + 1;
                const isLong = next % 4 === 0;
                setTimeout(() => startBreak(isLong), 500);
                return next;
              });
            } else if (cfg.mode === "infinite") {
              // Keep interval running, just reset the counter
              setSessionCount(c => c + 1);
              setTotalSeconds(3600);
              return 3600;
            } else {
              // Free mode - go idle
              clearTimer();
              setSessionCount(c => c + 1);
              setState("idle");
            }
          } else {
            // Break completed
            clearTimer();
            cfg.onBreakComplete?.();
            setState("idle");
            const secs = cfg.workMinutes * 60;
            setTotalSeconds(secs);
            return secs;
          }
          return 0;
        }
        return Math.max(0, prev - burnRateRef.current);
      });
    }, 1000);

    return clearTimer;
  }, [state, clearTimer, startBreak]);

  // Update when config changes while idle
  useEffect(() => {
    if (state === "idle") {
      const secs = config.mode === "infinite" ? 3600 : config.workMinutes * 60;
      setRemainingSeconds(secs);
      setTotalSeconds(secs);
    }
  }, [config.workMinutes, config.mode, state]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const setBurnRate = useCallback((rate: number) => {
    burnRateRef.current = rate;
  }, []);

  return {
    state,
    progress,
    remainingSeconds,
    totalSeconds,
    display,
    sessionCount,
    streak,
    start,
    pause,
    toggle,
    reset,
    startBreak,
    setBurnRate,
  };
}
