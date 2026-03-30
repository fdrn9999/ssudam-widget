import { useState, useEffect, useCallback } from "react";
import { Cigarette } from "../components/Cigarette/Cigarette";
import { AshEffect, useAshEffect } from "../components/AshEffect";
import { TimerDisplay } from "../components/TimerDisplay";
import { MemoPanel } from "../components/MemoPanel";
import { useTimer } from "../hooks/useTimer";
import { useCigarette } from "../hooks/useCigarette";
import { useSmokeParticles } from "../hooks/useSmokeParticles";
import { useSettings } from "../hooks/useLocalStorage";
import { saveDailyStats, loadDailyStats } from "../stores/settingsStore";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

export function MainWidget() {
  const { settings } = useSettings();
  const [memoOpen, setMemoOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const { particles: ashParticles, triggerFlick } = useAshEffect();

  const timer = useTimer({
    workMinutes: settings.workMinutes,
    breakMinutes: settings.breakMinutes,
    longBreakMinutes: settings.longBreakMinutes,
    mode: settings.timerMode,
    onSessionComplete: async () => {
      if (settings.notifySession) {
        let granted = await isPermissionGranted();
        if (!granted) {
          const perm = await requestPermission();
          granted = perm === "granted";
        }
        if (granted) {
          sendNotification({
            title: "담타 위젯",
            body: "담배 한 대 다 폈어요! 🚬 휴식하세요.",
          });
        }
      }

      // Save daily stats
      try {
        const today = new Date().toISOString().split("T")[0];
        const stats = await loadDailyStats(today);
        stats.sessionsCompleted += 1;
        stats.totalFocusMinutes += settings.workMinutes;
        stats.maxStreak = Math.max(stats.maxStreak, stats.sessionsCompleted);
        await saveDailyStats(stats);
      } catch { /* ignore store errors */ }
    },
  });

  const isActive = timer.state === "running";
  const cigarette = useCigarette(timer.progress, isActive);
  const showSmoke = (isActive && cigarette.isLit) || isHolding;
  const smokeParticles = useSmokeParticles(
    showSmoke,
    isHolding ? "high" : settings.smokeAmount
  );

  // Handle memo panel resize
  useEffect(() => {
    const width = memoOpen ? 340 : 100;
    invoke("set_main_window_size", { width, height: 480 }).catch(() => {});
  }, [memoOpen]);

  // Light up on click when idle
  const handleCigaretteClick = useCallback(() => {
    if (timer.state === "idle") {
      cigarette.lightUp();
      timer.start();
    } else {
      timer.toggle();
    }
  }, [timer, cigarette]);

  const handleFlickAsh = useCallback(() => {
    const hadAsh = cigarette.flickAsh();
    if (hadAsh) {
      triggerFlick(cigarette.ashHeight);
    }
  }, [cigarette, triggerFlick]);

  const handleNewCigarette = useCallback(() => {
    timer.reset();
    cigarette.resetCigarette();
  }, [timer, cigarette]);

  // Listen for tray events from Rust backend
  useEffect(() => {
    const unlisten = listen<string>("tray-event", (event) => {
      switch (event.payload) {
        case "timer-toggle":
          handleCigaretteClick();
          break;
        case "new-cigarette":
          handleNewCigarette();
          break;
        case "memo-toggle":
          setMemoOpen(p => !p);
          break;
        case "flick-ash":
          handleFlickAsh();
          break;
      }
    });
    return () => { unlisten.then(fn => fn()).catch(() => {}); };
  }, [handleCigaretteClick, handleNewCigarette, handleFlickAsh]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey) return;
      switch (e.key.toUpperCase()) {
        case "A":
          e.preventDefault();
          handleFlickAsh();
          break;
        case "M":
          e.preventDefault();
          setMemoOpen(p => !p);
          break;
        case "S":
          e.preventDefault();
          handleCigaretteClick();
          break;
        case "N":
          e.preventDefault();
          handleNewCigarette();
          break;
        case "D":
          e.preventDefault();
          getCurrentWindow().isVisible().then(visible => {
            if (visible) getCurrentWindow().hide();
            else getCurrentWindow().show();
          });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlickAsh, handleCigaretteClick, handleNewCigarette]);

  return (
    <div
      className="flex h-screen select-none rounded-xl overflow-hidden"
      style={{ opacity: settings.widgetOpacity, background: "rgba(17,17,17,0.92)" }}
    >
      {/* Memo Panel */}
      {memoOpen && (
        <div className="flex-shrink-0">
          <MemoPanel isOpen={memoOpen} onClose={() => setMemoOpen(false)} />
        </div>
      )}

      {/* Cigarette Area */}
      <div className="flex flex-col items-center justify-end w-[100px] h-full relative">
        {/* Drag handle — 창 이동 영역 */}
        <div
          className="absolute top-0 left-0 right-0 h-8 cursor-grab z-20 flex items-center justify-center"
          onMouseDown={() => getCurrentWindow().startDragging().catch(() => {})}
        >
          <div className="w-6 h-1 rounded-full bg-gray-600 opacity-40" />
        </div>

        {/* Memo bubble toggle */}
        <button
          onClick={() => setMemoOpen(!memoOpen)}
          className="absolute top-8 right-2 text-lg opacity-50 hover:opacity-100 transition-opacity z-10"
          title="메모 열기/닫기"
        >
          💭
        </button>

        {/* Settings button */}
        <button
          onClick={() => invoke("open_settings")}
          className="absolute top-8 left-1 text-sm opacity-30 hover:opacity-80 transition-opacity z-10"
          title="설정"
        >
          ⚙️
        </button>

        {/* Cigarette */}
        <div className="relative">
          <AshEffect particles={ashParticles} />
          <Cigarette
            ashHeight={cigarette.ashHeight}
            paperHeight={cigarette.paperHeight}
            isLit={cigarette.isLit}
            isActive={isActive}
            showSmoke={showSmoke}
            skin={settings.cigaretteSkin}
            smokeParticles={smokeParticles}
            emberGlow={settings.emberGlow}
            onBodyClick={handleCigaretteClick}
            onFlickAsh={handleFlickAsh}
            onHoldStart={() => { setIsHolding(true); timer.setBurnRate(3); }}
            onHoldEnd={() => { setIsHolding(false); timer.setBurnRate(1); }}
          />
        </div>

        {/* Timer display */}
        <TimerDisplay display={timer.display} state={timer.state} isBurning={isHolding} />

        {/* Session counter */}
        <div className="text-[8px] text-gray-600 mb-2">
          🚬 {timer.sessionCount}
        </div>
      </div>
    </div>
  );
}
