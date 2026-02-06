import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const BREATH_PHASES: { phase: BreathPhase; duration: number; label: string }[] = [
  { phase: "inhale", duration: 4, label: "Breathe In" },
  { phase: "hold", duration: 4, label: "Hold" },
  { phase: "exhale", duration: 4, label: "Breathe Out" },
  { phase: "rest", duration: 4, label: "Rest" },
];

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setCurrentPhaseIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % BREATH_PHASES.length;
            if (nextIndex === 0) {
              setCycleCount((c) => c + 1);
            }
            return nextIndex;
          });
          return BREATH_PHASES[(currentPhaseIndex + 1) % BREATH_PHASES.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(BREATH_PHASES[0].duration);
    setCycleCount(0);
  };

  const stopExercise = () => {
    setIsActive(false);
  };

  const currentPhase = BREATH_PHASES[currentPhaseIndex];
  const circleScale = currentPhase.phase === "inhale" ? 1.3 : currentPhase.phase === "exhale" ? 0.8 : 1;

  return (
    <div className="p-6 rounded-3xl bg-card shadow-card border border-border">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-medium text-foreground mb-2">Box Breathing</h3>
        <p className="text-sm text-muted-foreground">
          A calming technique to reduce anxiety and stress
        </p>
      </div>

      {/* Breathing visualization */}
      <div className="relative h-48 flex items-center justify-center mb-6">
        <div
          className="absolute w-32 h-32 rounded-full gradient-calm transition-transform duration-1000"
          style={{ transform: `scale(${isActive ? circleScale : 1})` }}
        />
        <div className="relative z-10 text-center">
          {isActive ? (
            <>
              <p className="text-2xl font-medium text-primary-foreground">{currentPhase.label}</p>
              <p className="text-4xl font-bold text-primary-foreground mt-2">{secondsRemaining}</p>
            </>
          ) : (
            <span className="text-4xl">🌬️</span>
          )}
        </div>
      </div>

      {/* Cycle counter */}
      {isActive && (
        <p className="text-center text-sm text-muted-foreground mb-4">
          Cycle {cycleCount + 1}
        </p>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isActive ? (
          <Button onClick={startExercise} className="rounded-full px-6">
            <Play className="w-4 h-4 mr-2" />
            Start Exercise
          </Button>
        ) : (
          <Button onClick={stopExercise} variant="outline" className="rounded-full px-6">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 rounded-2xl bg-muted">
        <p className="text-sm text-muted-foreground text-center">
          <strong>How it works:</strong> Inhale for 4 seconds, hold for 4, exhale for 4, rest for 4. 
          Repeat for 3-4 cycles to feel calmer.
        </p>
      </div>
    </div>
  );
};
