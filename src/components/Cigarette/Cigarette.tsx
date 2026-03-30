import { Ash } from "./Ash";
import { Ember } from "./Ember";
import { Paper } from "./Paper";
import { Filter } from "./Filter";
import { SmokeParticles } from "./SmokeParticles";
import { SmokeParticle } from "../../hooks/useSmokeParticles";

interface CigaretteProps {
  ashHeight: number;
  paperHeight: number;
  isLit: boolean;
  isActive: boolean;
  showSmoke: boolean;
  skin?: "default" | "menthol" | "slim";
  smokeParticles: SmokeParticle[];
  emberGlow?: number;
  onBodyClick?: () => void;
  onFlickAsh?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
}

export function Cigarette({
  ashHeight,
  paperHeight,
  isLit,
  isActive,
  showSmoke,
  skin = "default",
  smokeParticles,
  emberGlow = 1,
  onBodyClick,
  onFlickAsh,
  onHoldStart,
  onHoldEnd,
}: CigaretteProps) {
  const width = skin === "slim" ? "w-10" : "w-14";

  return (
    <div className={`flex flex-col items-center ${width} relative ${!isLit ? "cigarette-unlit" : ""}`}>
      {/* Smoke */}
      {showSmoke && <SmokeParticles particles={smokeParticles} />}

      {/* Clickable body: Ash + Ember + Paper → 타이머 시작/일시정지 */}
      <div className="cursor-pointer w-full" onClick={onBodyClick}>
        <Ash height={ashHeight} />
        {isLit && paperHeight > 0 && <Ember isActive={isActive} glowIntensity={emberGlow} />}
        <Paper height={paperHeight} skin={skin} />
      </div>

      {/* Filter → 별도 인터랙션 (홀드: 연기+드래그, 더블클릭: 재떨기) */}
      <Filter
        skin={skin}
        onDoubleClick={onFlickAsh}
        onHoldStart={onHoldStart}
        onHoldEnd={onHoldEnd}
      />
    </div>
  );
}
