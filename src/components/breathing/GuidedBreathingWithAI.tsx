import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Wind, Heart, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pose, Results } from "@mediapipe/pose";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";

type Exercise = "box" | "calm" | null;

const EXERCISES = {
  box: {
    name: "Box Breathing",
    description: "4 seconds each phase",
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    icon: <Wind className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    targetCycles: 4
  },
  calm: {
    name: "Calm Breathing",
    description: "5 seconds in, 5 seconds out",
    pattern: { inhale: 5, exhale: 5 },
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    targetCycles: 5
  }
};

const DAILY_GOAL = 10;

export const GuidedBreathingWithAI = () => {
  // Exercise state
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfter">("inhale");
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [detectedPhase, setDetectedPhase] = useState<"inhale" | "exhale" | "hold" | "calibrating">("calibrating");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [breathCount, setBreathCount] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showSuccessTick, setShowSuccessTick] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Detection refs
  const shoulderHistoryRef = useRef<number[]>([]);
  const smoothedValueRef = useRef<number | null>(null);
  const baselineRef = useRef<number | null>(null);
  const calibrationFramesRef = useRef<number>(0);
  const lastPhaseRef = useRef<"inhale" | "exhale" | "hold">("hold");
  const lastBreathTimeRef = useRef<number>(Date.now());
  const movementRangeRef = useRef<{ min: number; max: number }>({ min: 0, max: 0 });

  const { toast } = useToast();

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Check if user is following the exercise correctly based on shoulder movement
  useEffect(() => {
    if (!isExerciseActive || !isCameraActive || !isCalibrated) {
      setIsCorrect(null);
      return;
    }

    // Match detected shoulder movement with expected phase
    if (currentPhase === "inhale" && detectedPhase === "inhale") {
      // Shoulders going up = green for inhale
      setIsCorrect(true);
    } else if ((currentPhase === "hold" || currentPhase === "holdAfter") && detectedPhase === "hold") {
      // Shoulders not moving = green for hold
      setIsCorrect(true);
    } else if (currentPhase === "exhale" && detectedPhase === "exhale") {
      // Shoulders going down = green for exhale
      setIsCorrect(true);
    } else {
      // Movement doesn't match expected phase = red X
      setIsCorrect(false);
    }
  }, [currentPhase, detectedPhase, isExerciseActive, isCameraActive, isCalibrated]);

  /* ============ EXERCISE LOGIC ============ */

  const startExercise = async (exercise: Exercise) => {
    if (!exercise) return;
    
    setSelectedExercise(exercise);
    setIsExerciseActive(true);
    setCycleCount(0);
    
    // Start camera
    await startCamera();
    
    // Start breathing cycle
    startBreathingCycle(EXERCISES[exercise]);
  };

  const startBreathingCycle = (exercise: typeof EXERCISES[keyof typeof EXERCISES]) => {
    let phase: "inhale" | "hold" | "exhale" | "holdAfter" = "inhale";
    let timeLeft = exercise.pattern.inhale;
    
    setCurrentPhase(phase);
    setCountdown(timeLeft);

    const interval = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        if (phase === "inhale" && "hold" in exercise.pattern && exercise.pattern.hold) {
          phase = "hold";
          timeLeft = exercise.pattern.hold;
        } else if ((phase === "inhale" && !("hold" in exercise.pattern)) || phase === "hold") {
          phase = "exhale";
          timeLeft = exercise.pattern.exhale;
        } else if (phase === "exhale" && "holdAfter" in exercise.pattern && exercise.pattern.holdAfter) {
          phase = "holdAfter";
          timeLeft = exercise.pattern.holdAfter;
        } else {
          // Cycle complete
          const newCycleCount = cycleCount + 1;
          setCycleCount(newCycleCount);
          
          // Check if target cycles reached
          if (newCycleCount >= exercise.targetCycles) {
            clearInterval(interval);
            setShowCongrats(true);
            toast({
              title: "🎉 Congratulations!",
              description: "You completed today's meditation session!",
              duration: 5000,
            });
            return;
          }
          
          phase = "inhale";
          timeLeft = exercise.pattern.inhale;
        }
        
        setCurrentPhase(phase);
        setCountdown(timeLeft);
      }
    }, 1000);

    (window as any).breathingInterval = interval;
  };

  const stopExercise = () => {
    setIsExerciseActive(false);
    setSelectedExercise(null);
    stopCamera();
    if ((window as any).breathingInterval) {
      clearInterval((window as any).breathingInterval);
    }
  };

  /* ============ CAMERA LOGIC ============ */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        initializeMediaPipe();
        setIsCameraActive(true);
        
        toast({
          title: "Camera Started",
          description: "Stay still for 3 seconds to calibrate...",
        });
      };
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        title: "Camera Error",
        description: "Please allow camera access",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    cameraRef.current?.stop();
    poseRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());

    cameraRef.current = null;
    poseRef.current = null;
    streamRef.current = null;
    setIsCameraActive(false);
    setIsCalibrated(false);
    setDetectedPhase("calibrating");
  };

  const initializeMediaPipe = () => {
    if (!videoRef.current) return;

    const pose = new Pose({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onPoseResults);
    poseRef.current = pose;

    const camera = new MediaPipeCamera(videoRef.current, {
      onFrame: async () => {
        if (poseRef.current && videoRef.current) {
          await poseRef.current.send({ image: videoRef.current });
        }
      },
      width: 1280,
      height: 720,
    });

    camera.start();
    cameraRef.current = camera;
  };

  const onPoseResults = (results: Results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = results.image.width;
    canvas.height = results.image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    drawShoulders(ctx, results.poseLandmarks, canvas.width, canvas.height);
    detectBreathing(results.poseLandmarks);
  };

  const drawShoulders = (ctx: CanvasRenderingContext2D, landmarks: any[], w: number, h: number) => {
    const left = landmarks[11];
    const right = landmarks[12];
    if (!left || !right) return;

    const colors = {
      inhale: "#3b82f6",
      exhale: "#ef4444",
      hold: "#f59e0b",
      calibrating: "#6b7280"
    };

    ctx.strokeStyle = colors[detectedPhase];
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(left.x * w, left.y * h);
    ctx.lineTo(right.x * w, right.y * h);
    ctx.stroke();

    [left, right].forEach(shoulder => {
      ctx.fillStyle = colors[detectedPhase];
      ctx.beginPath();
      ctx.arc(shoulder.x * w, shoulder.y * h, 8, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const detectBreathing = (landmarks: any[]) => {
    const left = landmarks[11];
    const right = landmarks[12];
    if (!left || !right) return;

    const rawY = (left.y + right.y) / 2;
    const shoulderDiff = Math.abs(left.y - right.y);
    const shoulderSpan = Math.abs(left.x - right.x);
    
    if (shoulderDiff > shoulderSpan * 0.3) return;

    const history = shoulderHistoryRef.current;
    history.push(rawY);
    if (history.length > 60) history.shift();
    if (history.length < 20) return;

    const alpha = 0.3;
    if (smoothedValueRef.current === null) {
      smoothedValueRef.current = rawY;
    } else {
      smoothedValueRef.current = alpha * rawY + (1 - alpha) * smoothedValueRef.current;
    }
    
    const smoothed = smoothedValueRef.current;

    if (!isCalibrated) {
      calibrationFramesRef.current++;
      if (calibrationFramesRef.current >= 90) {
        const sortedHistory = [...history].sort((a, b) => a - b);
        baselineRef.current = sortedHistory[Math.floor(sortedHistory.length / 2)];
        setIsCalibrated(true);
        setDetectedPhase("hold");
      }
      return;
    }

    if (baselineRef.current === null) return;
    
    const movement = smoothed - baselineRef.current;

    if (movement < movementRangeRef.current.min) movementRangeRef.current.min = movement;
    if (movement > movementRangeRef.current.max) movementRangeRef.current.max = movement;

    const observedRange = movementRangeRef.current.max - movementRangeRef.current.min;
    const baseThreshold = Math.max(0.005, observedRange * 0.25);
    
    const recentHistory = history.slice(-15);
    const trend = calculateTrend(recentHistory);

    const now = Date.now();
    const timeSinceLastBreath = now - lastBreathTimeRef.current;

    if (movement < -baseThreshold && trend < -0.0002 && lastPhaseRef.current !== "inhale") {
      setDetectedPhase("inhale");
      lastPhaseRef.current = "inhale";
    } else if (movement > baseThreshold && trend > 0.0002 && lastPhaseRef.current === "inhale") {
      if (timeSinceLastBreath > 1500) {
        setDetectedPhase("exhale");
        lastPhaseRef.current = "exhale";
        lastBreathTimeRef.current = now;
        
        const newCount = breathCount + 1;
        setBreathCount(newCount);
        
        // Show success tick animation
        setShowSuccessTick(true);
        setTimeout(() => setShowSuccessTick(false), 1500);
        
        if (newCount >= DAILY_GOAL && !showCongrats) {
          setShowCongrats(true);
          toast({
            title: "🎉 Challenge Complete!",
            description: `You completed ${DAILY_GOAL} breathing cycles!`,
            duration: 5000,
          });
        }
      }
    } else if (Math.abs(movement) < baseThreshold * 0.5 && Math.abs(trend) < 0.0001) {
      if (lastPhaseRef.current !== "hold") {
        setDetectedPhase("hold");
        lastPhaseRef.current = "hold";
      }
    }
  };

  const calculateTrend = (values: number[]): number => {
    if (values.length < 2) return 0;
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  };

  /* ============ UI RENDER ============ */

  if (!selectedExercise) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold mb-1">AI-Guided Breathing</h3>
          <p className="text-xs text-muted-foreground">
            Choose an exercise and let AI guide you
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(EXERCISES) as Exercise[]).map((key) => {
            if (!key) return null;
            const ex = EXERCISES[key];
            return (
              <Card 
                key={key}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => startExercise(key)}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${ex.color} flex items-center justify-center text-white mb-3 mx-auto`}>
                  {ex.icon}
                </div>
                <h4 className="font-semibold text-sm text-center mb-1">{ex.name}</h4>
                <p className="text-xs text-muted-foreground text-center mb-2">{ex.description}</p>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {ex.targetCycles} cycles
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const exercise = EXERCISES[selectedExercise];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{exercise.name}</h3>
          <p className="text-xs text-muted-foreground">Follow the guide and breathe</p>
        </div>
        <Button variant="outline" size="sm" onClick={stopExercise}>
          Stop
        </Button>
      </div>

      {/* Video Feed */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="w-full h-auto" style={{ maxHeight: "300px" }} />
        
        {!isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Starting camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Guide */}
      <div className="grid grid-cols-2 gap-3">
        {/* Visual Guide */}
        <Card className="p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Follow</p>
            <div 
              className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br transition-all duration-1000 flex items-center justify-center ${
                currentPhase === "inhale" ? "scale-125 from-blue-400 to-blue-600" :
                currentPhase === "exhale" ? "scale-75 from-red-400 to-red-600" :
                "scale-100 from-amber-400 to-amber-600"
              }`}
            >
              <span className="text-2xl font-bold text-white">{countdown}</span>
            </div>
            <p className="text-sm font-semibold mt-2 capitalize">{currentPhase}</p>
            <p className="text-xs text-muted-foreground">Cycle {cycleCount}/{selectedExercise ? EXERCISES[selectedExercise].targetCycles : 0}</p>
          </div>
        </Card>

        {/* AI Feedback */}
        <Card className="p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">AI Detection</p>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2">
              {showSuccessTick ? (
                <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              ) : isCorrect === true ? (
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              ) : isCorrect === false ? (
                <XCircle className="w-16 h-16 text-red-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              )}
            </div>
            <p className="text-sm font-semibold">
              {showSuccessTick ? "Great!" : isCorrect === true ? "Correct!" : isCorrect === false ? "Adjust" : "Detecting..."}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{detectedPhase === "calibrating" ? "ready" : detectedPhase}</p>
          </div>
        </Card>
      </div>

      {/* Progress */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold">Exercise Progress</span>
          <span className="text-xs font-bold text-blue-600">
            {cycleCount}/{selectedExercise ? EXERCISES[selectedExercise].targetCycles : 0} cycles
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ 
              width: selectedExercise 
                ? `${Math.min((cycleCount / EXERCISES[selectedExercise].targetCycles) * 100, 100)}%` 
                : '0%' 
            }}
          />
        </div>
      </Card>

      {/* Congrats Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl animate-bounce">🎉</div>
            <h3 className="text-xl font-bold">Congratulations!</h3>
            <p className="text-sm">You completed today's meditation session!</p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-600">{cycleCount}</p>
              <p className="text-xs text-gray-600">Cycles Completed</p>
            </div>
            <p className="text-xs text-muted-foreground italic">
              "Breath is the bridge which connects life to consciousness."
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setShowCongrats(false);
                  stopExercise();
                }} 
                variant="outline"
                className="flex-1"
              >
                Done
              </Button>
              <Button 
                onClick={() => {
                  setShowCongrats(false);
                  setCycleCount(0);
                  setBreathCount(0);
                  if (selectedExercise) {
                    startBreathingCycle(EXERCISES[selectedExercise]);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Do Again
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
