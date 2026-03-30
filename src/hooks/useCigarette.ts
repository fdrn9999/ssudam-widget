import { useState, useCallback } from "react";

/**
 * 진짜 담배 물리학:
 *
 *  전체 담배 = [재] + [불씨] + [종이] + [필터]
 *
 *  - 총 연소 가능 길이 = maxBurnLength (예: 280px)
 *  - burnedLength = progress * maxBurnLength  (지금까지 탄 길이)
 *  - paperHeight = maxBurnLength - burnedLength  (남은 종이)
 *  - ashHeight = burnedLength - flickedTotal  (아직 안 털린 재)
 *  - 재를 털면 flickedTotal += ashHeight → 재 사라짐 → 담배 전체가 짧아짐
 */
export function useCigarette(progress: number, _isActive: boolean) {
  const maxBurnLength = 280; // 연소 가능한 총 길이 (px)
  const [isLit, setIsLit] = useState(false);
  const [flickedTotal, setFlickedTotal] = useState(0); // 지금까지 털어낸 재 총합

  const burnedLength = isLit ? progress * maxBurnLength : 0;
  const paperHeight = maxBurnLength - burnedLength;
  const ashHeight = Math.max(0, burnedLength - flickedTotal);

  const lightUp = useCallback(() => {
    setIsLit(true);
    setFlickedTotal(0);
  }, []);

  const flickAsh = useCallback(() => {
    const currentAsh = ashHeight;
    if (currentAsh > 2) {
      // 현재 쌓인 재를 flickedTotal에 더함 → 재 높이 0으로
      setFlickedTotal(prev => prev + currentAsh);
      return true; // 파티클 효과 트리거
    }
    return false;
  }, [ashHeight]);

  const resetCigarette = useCallback(() => {
    setIsLit(false);
    setFlickedTotal(0);
  }, []);

  return {
    ashHeight,
    paperHeight,
    isLit,
    flickedTotal, // 재떨기 파티클 위치 계산용
    lightUp,
    flickAsh,
    resetCigarette,
  };
}
