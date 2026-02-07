import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, Timer, Heart, Zap, Moon, Sun } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfter?: number;
  };
  benefits: string[];
  difficulty: "Easy" | "Medium" | "Advanced";
}

const exercises: Exercise[] = [
  {
    id: "4-7-8",
    name: "4-7-8 Relaxation",
    description: "Dr. Weil's calming breath technique for sleep and anxiety",
    icon: <Moon className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ["Reduces anxiety", "Promotes sleep", "Calms nervous system"],
    difficulty: "Easy"
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Navy SEAL technique for focus and stress management",
    icon: <Wind className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    benefits: ["Improves focus", "Reduces stress", "Enhances performance"],
    difficulty: "Medium"
  },
  {
    id: "calm",
    name: "Calm Breathing",
    description: "Simple deep breathing for instant relaxation",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    pattern: { inhale: 5, exhale: 5 },
    benefits: ["Quick relaxation", "Lowers heart rate", "Easy to do anywhere"],
    difficulty: "Easy"
  },
  {
    id: "energize",
    name: "Energizing Breath",
    description: "Quick breathing to boost energy and alertness",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    pattern: { inhale: 3, exhale: 6 },
    benefits: ["Increases energy", "Improves alertness", "Boosts mood"],
    difficulty: "Easy"
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Optimal breathing rate for heart-brain coherence",
    icon: <Sun className="w-6 h-6" />,
    color: "from-green-500 to-teal-500",
    pattern: { inhale: 6, exhale: 6 },
    benefits: ["Balances nervous system", "Improves HRV", "Reduces blood pressure"],
    difficulty: "Medium"
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "Yogic breathing for balance and clarity",
    icon: <Wind className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    pattern: { inhale: 4, hold: 4, exhale: 4 },
    benefits: ["Balances energy", "Clears mind", "Reduces anxiety"],
    difficulty: "Advanced"
  }
];

export const BreathingExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfter">("inhale");
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setCycleCount(0);
    startBreathingCycle(exercise);
  };

  const startBreathingCycle = (exercise: Exercise) => {
    let phase: "inhale" | "hold" | "exhale" | "holdAfter" = "inhale";
    let timeLeft = exercise.pattern.inhale;
    
    setCurrentPhase(phase);
    setCountdown(timeLeft);

    const interval = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        // Move to next phase
        if (phase === "inhale" && exercise.pattern.hold) {
          phase = "hold";
          timeLeft = exercise.pattern.hold;
        } else if ((phase === "inhale" && !exercise.pattern.hold) || phase === "hold") {
          phase = "exhale";
          timeLeft = exercise.pattern.exhale;
        } else if (phase === "exhale" && exercise.pattern.holdAfter) {
          phase = "holdAfter";
          timeLeft = exercise.pattern.holdAfter;
        } else {
          // Cycle complete
          setCycleCount(prev => prev + 1);
          phase = "inhale";
          timeLeft = exercise.pattern.inhale;
        }
        
        setCurrentPhase(phase);
        setCountdown(timeLeft);
      }
    }, 1000);

    // Store interval ID for cleanup
    (window as any).breathingInterval = interval;
  };

  const stopExercise = () => {
    setIsActive(false);
    setSelectedExercise(null);
    if ((window as any).breathingInterval) {
      clearInterval((window as any).breathingInterval);
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "holdAfter": return "Hold";
      default: return "";
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inhale": return "from-blue-400 to-blue-600";
      case "hold": return "from-amber-400 to-amber-600";
      case "exhale": return "from-green-400 to-green-600";
      case "holdAfter": return "from-purple-400 to-purple-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  if (isActive && selectedExercise) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-8">
          {/* Exercise Name */}
          <div>
            <h3 className="text-2xl font-bold mb-2">{selectedExercise.name}</h3>
            <p className="text-sm text-muted-foreground">Cycle {cycleCount + 1}</p>
          </div>

          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center h-80">
            <div 
              className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ${
                currentPhase === "inhale" ? "scale-150 opacity-80" :
                currentPhase === "exhale" ? "scale-75 opacity-60" :
                "scale-100 opacity-70"
              }`}
            />
            <div className="relative z-10 text-center text-white">
              <p className="text-6xl font-bold mb-2">{countdown}</p>
              <p className="text-2xl font-semibold">{getPhaseText()}</p>
            </div>
          </div>

          {/* Pattern Display */}
          <div className="flex justify-center gap-2 text-sm">
            <Badge variant="outline">
              Inhale: {selectedExercise.pattern.inhale}s
            </Badge>
            {selectedExercise.pattern.hold && (
              <Badge variant="outline">
                Hold: {selectedExercise.pattern.hold}s
              </Badge>
            )}
            <Badge variant="outline">
              Exhale: {selectedExercise.pattern.exhale}s
            </Badge>
            {selectedExercise.pattern.holdAfter && (
              <Badge variant="outline">
                Hold: {selectedExercise.pattern.holdAfter}s
              </Badge>
            )}
          </div>

          {/* Controls */}
          <Button 
            onClick={stopExercise}
            variant="outline"
            size="lg"
          >
            Stop Exercise
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wind className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold">Guided Breathing Exercises</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose an exercise and follow the visual guide
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => startExercise(exercise)}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${exercise.color} flex items-center justify-center text-white flex-shrink-0`}>
                {exercise.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{exercise.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {exercise.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.description}
                </p>

                {/* Pattern */}
                <div className="flex gap-1 text-xs mb-3 flex-wrap">
                  <Badge variant="outline" className="bg-blue-50">
                    ↑ {exercise.pattern.inhale}s
                  </Badge>
                  {exercise.pattern.hold && (
                    <Badge variant="outline" className="bg-amber-50">
                      ⏸ {exercise.pattern.hold}s
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-green-50">
                    ↓ {exercise.pattern.exhale}s
                  </Badge>
                  {exercise.pattern.holdAfter && (
                    <Badge variant="outline" className="bg-purple-50">
                      ⏸ {exercise.pattern.holdAfter}s
                    </Badge>
                  )}
                </div>

                {/* Benefits */}
                <div className="space-y-1">
                  {exercise.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              variant="outline"
            >
              <Timer className="w-4 h-4 mr-2" />
              Start Exercise
            </Button>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-sm mb-2 text-blue-900">💡 Tips for Best Results</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Find a quiet, comfortable place to sit or lie down</li>
          <li>• Keep your back straight and shoulders relaxed</li>
          <li>• Breathe through your nose when possible</li>
          <li>• Focus on the rhythm and let thoughts pass by</li>
          <li>• Practice for at least 5 minutes for best results</li>
        </ul>
      </Card>
    </div>
  );
};
