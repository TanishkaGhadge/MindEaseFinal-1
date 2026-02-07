import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Activity, Wind, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pose, Results } from "@mediapipe/pose";
import { Camera as MediaPipeCamera } from "@mediapipe/camera_utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Breathing detection state type
type BreathingPhase = "inhale" | "exhale" | "hold" | "calibrating";

// Daily breathing challenge goal
const DAILY_BREATH_GOAL = 10; // Complete 10 breathing cycles

export const MediaPipeBreathingDetector = () => {
  // UI State
  const [isActive, setIsActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("calibrating");
  const [shoulderY, setShoulderY] = useState(0);
  const [smoothedY, setSmoothedY] = useState(0);
  const [breathingRate, setBreathingRate] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState(50); // 0-100 percentage

  // Refs for video/canvas
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // MediaPipe refs
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Breathing detection refs
  const shoulderHistoryRef = useRef<number[]>([]);
  const smoothedValueRef = useRef<number | null>(null);
  const baselineRef = useRef<number | null>(null);
  const calibrationFramesRef = useRef<number>(0);
  const lastPhaseRef = useRef<BreathingPhase>("hold");
  const lastBreathTimeRef = useRef<number>(Date.now());
  const breathTimestampsRef = useRef<number[]>([]);
  
  // Adaptive threshold refs
  const movementRangeRef = useRef<{ min: number; max: number }>({ min: 0, max: 0 });

  const { toast } = useToast();

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ---------------- CAMERA CONTROL ---------------- */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          facingMode: "user" 
        },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        initializeMediaPipe();
        setIsActive(true);
        setCurrentPhase("calibrating");

        toast({
          title: "Camera Started",
          description: "Stay still for 3 seconds to calibrate...",
        });
      };
    } catch (err) {
      console.error("Camera error:", err);
      toast({
        title: "Camera Error",
        description: "Please allow camera access and ensure your camera is not in use",
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

    setIsActive(false);
  };

  /* ---------------- MEDIAPIPE INITIALIZATION ---------------- */

  const initializeMediaPipe = () => {
    if (!videoRef.current) return;

    const pose = new Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
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

  /* ---------------- POSE RESULTS HANDLER ---------------- */

  const onPoseResults = (results: Results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = results.image.width;
    canvas.height = results.image.height;

    // Draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Draw shoulder visualization
    drawShoulderVisualization(ctx, results.poseLandmarks, canvas.width, canvas.height);
    
    // Detect breathing from landmarks
    detectBreathing(results.poseLandmarks);
  };

  /* ---------------- VISUALIZATION ---------------- */

  const drawShoulderVisualization = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    w: number,
    h: number
  ) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    if (!leftShoulder || !rightShoulder) return;

    // Draw shoulder line with phase-based color
    const phaseColors = {
      inhale: "#3b82f6",    // Blue (shoulders rising)
      exhale: "#ef4444",    // Red (shoulders dropping)
      hold: "#f59e0b",      // Amber
      calibrating: "#6b7280" // Gray
    };
    
    ctx.strokeStyle = phaseColors[currentPhase];
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x * w, leftShoulder.y * h);
    ctx.lineTo(rightShoulder.x * w, rightShoulder.y * h);
    ctx.stroke();

    // Draw shoulder landmarks
    [leftShoulder, rightShoulder].forEach(shoulder => {
      ctx.fillStyle = phaseColors[currentPhase];
      ctx.beginPath();
      ctx.arc(shoulder.x * w, shoulder.y * h, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // White center
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(shoulder.x * w, shoulder.y * h, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw baseline reference line if calibrated
    if (baselineRef.current !== null && isCalibrated) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      const baselineY = baselineRef.current * h;
      ctx.moveTo(leftShoulder.x * w, baselineY);
      ctx.lineTo(rightShoulder.x * w, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw phase indicator text with larger, more visible style
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    const phaseText = currentPhase === "inhale" ? "BREATHE IN ↑" :
                      currentPhase === "exhale" ? "BREATHE OUT ↓" :
                      currentPhase === "hold" ? "HOLD" :
                      "CALIBRATING";
    const textX = w / 2;
    const textY = 50;
    ctx.strokeText(phaseText, textX, textY);
    ctx.fillText(phaseText, textX, textY);
  };

  /* ---------------- BREATHING DETECTION LOGIC ---------------- */

  const detectBreathing = (landmarks: any[]) => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    // Ensure both shoulders are detected
    if (!leftShoulder || !rightShoulder) return;

    // Calculate average shoulder Y position (normalized 0-1)
    const rawY = (leftShoulder.y + rightShoulder.y) / 2;
    setShoulderY(rawY);

    // Check for false positives: shoulders should move together
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderSpan = Math.abs(leftShoulder.x - rightShoulder.x);
    
    // Reject if shoulders are too asymmetric (sideways motion or bad detection)
    if (shoulderDiff > shoulderSpan * 0.3) {
      console.log("Rejected: Asymmetric shoulder movement");
      return;
    }

    // Add to sliding window history (keep last 60 frames ~2 seconds at 30fps)
    const history = shoulderHistoryRef.current;
    history.push(rawY);
    if (history.length > 60) history.shift();

    // Need minimum frames for reliable detection
    if (history.length < 20) return;

    // Apply exponential smoothing (alpha = 0.3 for balance between responsiveness and stability)
    const alpha = 0.3;
    if (smoothedValueRef.current === null) {
      smoothedValueRef.current = rawY;
    } else {
      smoothedValueRef.current = alpha * rawY + (1 - alpha) * smoothedValueRef.current;
    }
    
    const smoothed = smoothedValueRef.current;
    setSmoothedY(smoothed);

    // Calibration phase: establish baseline
    if (!isCalibrated) {
      calibrationFramesRef.current++;
      
      // Collect 90 frames (~3 seconds) for calibration
      if (calibrationFramesRef.current >= 90) {
        // Use median of history for robust baseline
        const sortedHistory = [...history].sort((a, b) => a - b);
        baselineRef.current = sortedHistory[Math.floor(sortedHistory.length / 2)];
        
        setIsCalibrated(true);
        setCurrentPhase("hold");
        
        toast({
          title: "Calibration Complete",
          description: "Start breathing slowly and deeply",
        });
      }
      return;
    }

    // Calculate movement from baseline
    if (baselineRef.current === null) return;
    
    const movement = smoothed - baselineRef.current;

    // Update adaptive movement range for dynamic threshold
    if (movement < movementRangeRef.current.min) {
      movementRangeRef.current.min = movement;
    }
    if (movement > movementRangeRef.current.max) {
      movementRangeRef.current.max = movement;
    }

    // Update visual indicator position (0-100%)
    // Map movement to indicator position
    const range = movementRangeRef.current.max - movementRangeRef.current.min;
    if (range > 0) {
      const normalizedMovement = (movement - movementRangeRef.current.min) / range;
      const position = 100 - (normalizedMovement * 100); // Invert so up = top
      setIndicatorPosition(Math.max(0, Math.min(100, position)));
    }

    // Calculate adaptive threshold based on observed range
    const observedRange = movementRangeRef.current.max - movementRangeRef.current.min;
    const baseThreshold = Math.max(0.005, observedRange * 0.25); // At least 0.5% of frame height
    
    // Temporal comparison: check trend over last 15 frames
    const recentHistory = history.slice(-15);
    const trend = calculateTrend(recentHistory);

    // Cooldown to prevent double-counting (minimum 1.5 seconds between breaths)
    const now = Date.now();
    const timeSinceLastBreath = now - lastBreathTimeRef.current;
    const minBreathInterval = 1500; // ms

    // Detect inhale: consistent downward movement (shoulders rise, Y decreases)
    if (movement < -baseThreshold && trend < -0.0002 && lastPhaseRef.current !== "inhale") {
      setCurrentPhase("inhale");
      lastPhaseRef.current = "inhale";
      console.log("Inhale detected", { movement, trend, threshold: baseThreshold });
    }
    
    // Detect exhale: consistent upward movement (shoulders drop, Y increases)
    else if (movement > baseThreshold && trend > 0.0002 && lastPhaseRef.current === "inhale") {
      if (timeSinceLastBreath > minBreathInterval) {
        setCurrentPhase("exhale");
        lastPhaseRef.current = "exhale";
        lastBreathTimeRef.current = now;
        
        // Increment breath count
        const newBreathCount = breathCount + 1;
        setBreathCount(newBreathCount);
        
        // Check if daily goal is reached
        if (newBreathCount >= DAILY_BREATH_GOAL && !showCongrats) {
          setShowCongrats(true);
          toast({
            title: "🎉 Congratulations!",
            description: `You completed today's breathing challenge! ${DAILY_BREATH_GOAL} breaths done!`,
            duration: 5000,
          });
        }
        
        // Track breathing rate
        breathTimestampsRef.current.push(now);
        if (breathTimestampsRef.current.length > 5) {
          breathTimestampsRef.current.shift();
        }
        updateBreathingRate();
        
        console.log("Exhale detected - Breath complete", { movement, trend, threshold: baseThreshold });
      }
    }
    
    // Hold phase: minimal movement
    else if (Math.abs(movement) < baseThreshold * 0.5 && Math.abs(trend) < 0.0001) {
      if (lastPhaseRef.current !== "hold") {
        setCurrentPhase("hold");
        lastPhaseRef.current = "hold";
      }
    }
  };

  // Calculate trend (slope) of recent values using linear regression
  const calculateTrend = (values: number[]): number => {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  };

  // Update breathing rate (breaths per minute)
  const updateBreathingRate = () => {
    const timestamps = breathTimestampsRef.current;
    if (timestamps.length < 2) return;
    
    const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
    const breathsPerMs = (timestamps.length - 1) / timeSpan;
    const breathsPerMinute = breathsPerMs * 60000;
    
    setBreathingRate(Math.round(breathsPerMinute));
  };

  /* ---------------- RESET FUNCTION ---------------- */

  const reset = () => {
    setBreathCount(0);
    setCurrentPhase("calibrating");
    setIsCalibrated(false);
    setBreathingRate(0);
    setShowCongrats(false);
    setIndicatorPosition(50);
    
    shoulderHistoryRef.current = [];
    smoothedValueRef.current = null;
    baselineRef.current = null;
    calibrationFramesRef.current = 0;
    lastPhaseRef.current = "hold";
    lastBreathTimeRef.current = Date.now();
    breathTimestampsRef.current = [];
    movementRangeRef.current = { min: 0, max: 0 };
    
    toast({
      title: "Reset Complete",
      description: "Stay still for calibration...",
    });
  };

  /* ---------------- UI RENDER ---------------- */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold">AI Breathing Detection</h3>
            <p className="text-xs text-gray-600">
              Real-time tracking using pose estimation
            </p>
          </div>
        </div>
        
        {isCalibrated && breathingRate > 0 && (
          <Badge variant="outline" className="text-sm px-3 py-1">
            {breathingRate} BPM
          </Badge>
        )}
      </div>

      {/* Instructions */}
      {!isActive && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">Instructions:</h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Sit upright with shoulders visible</li>
            <li>Ensure good lighting</li>
            <li>Stay still for 3 seconds (calibration)</li>
            <li>Breathe slowly and deeply</li>
          </ul>
        </div>
      )}

      {/* Video Feed with Visual Indicator */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef} 
          className="hidden" 
          playsInline
          muted
        />
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto"
          style={{ maxHeight: "400px" }}
        />
        
        {/* Visual Breathing Indicator - Overlaid on video */}
        {isActive && isCalibrated && (
          <div className="absolute right-4 top-4 bottom-4 w-16 flex flex-col items-center">
            {/* Breathing Track */}
            <div className="relative w-12 flex-1 bg-gray-800/50 rounded-full backdrop-blur-sm border-2 border-white/30">
              {/* Moving Indicator */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full transition-all duration-300 shadow-lg"
                style={{ 
                  top: `${indicatorPosition}%`,
                  transform: `translate(-50%, -50%)`,
                  backgroundColor: currentPhase === "inhale" ? "#3b82f6" : 
                                   currentPhase === "exhale" ? "#ef4444" : 
                                   "#f59e0b",
                  boxShadow: currentPhase === "inhale" ? "0 0 20px #3b82f6" : 
                             currentPhase === "exhale" ? "0 0 20px #ef4444" : 
                             "0 0 20px #f59e0b"
                }}
              >
                <div className="absolute inset-2 bg-white rounded-full animate-pulse" />
              </div>
              
              {/* Top marker (Inhale) */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-400">
                ↑
              </div>
              
              {/* Bottom marker (Exhale) */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400">
                ↓
              </div>
            </div>
            
            {/* Labels */}
            <div className="mt-2 text-center">
              <div className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
                {currentPhase === "inhale" ? "IN" : 
                 currentPhase === "exhale" ? "OUT" : 
                 "HOLD"}
              </div>
            </div>
          </div>
        )}
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Camera not started</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Dashboard */}
      {isActive && (
        <div className="space-y-3">
          {/* Daily Challenge Progress */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-sm">Daily Breathing Challenge</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {breathCount}/{DAILY_BREATH_GOAL}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((breathCount / DAILY_BREATH_GOAL) * 100, 100)}%` }}
              />
            </div>
            
            {breathCount >= DAILY_BREATH_GOAL && (
              <div className="mt-2 text-center">
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  ✓ Challenge Complete!
                </span>
              </div>
            )}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Breath Count */}
            <div className="p-4 bg-white rounded-lg border text-center">
              <Wind className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xs text-gray-600 mb-1">Breaths</p>
              <p className="text-3xl font-bold text-green-600">{breathCount}</p>
            </div>

            {/* Current Phase */}
            <div className="p-4 bg-white rounded-lg border text-center">
              <Waves className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-600 mb-1">Phase</p>
              <div className="flex items-center justify-center gap-2">
                <div 
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    currentPhase === "inhale" ? "bg-blue-500" :
                    currentPhase === "exhale" ? "bg-red-500" :
                    currentPhase === "hold" ? "bg-amber-500" :
                    "bg-gray-500"
                  }`}
                />
                <p className="text-lg font-bold capitalize">
                  {currentPhase}
                </p>
              </div>
            </div>

            {/* BPM */}
            <div className="p-4 bg-white rounded-lg border text-center">
              <Activity className="w-6 h-6 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-600 mb-1">BPM</p>
              <p className="text-3xl font-bold text-purple-600">
                {breathingRate || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center space-y-4">
              {/* Celebration Icon */}
              <div className="text-6xl animate-bounce">🎉</div>
              
              {/* Title */}
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Congratulations!
              </h2>
              
              {/* Message */}
              <p className="text-lg text-gray-700">
                You completed today's breathing challenge!
              </p>
              
              {/* Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{breathCount}</p>
                    <p className="text-xs text-gray-600">Breaths Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{breathingRate}</p>
                    <p className="text-xs text-gray-600">Breaths Per Minute</p>
                  </div>
                </div>
              </div>
              
              {/* Motivational Message */}
              <p className="text-sm text-gray-600 italic">
                "Breath is the bridge which connects life to consciousness, which unites your body to your thoughts." - Thích Nhất Hạnh
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowCongrats(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue
                </Button>
                <Button 
                  onClick={() => {
                    setShowCongrats(false);
                    reset();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Start New Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button 
            className="flex-1 h-11" 
            onClick={startCamera}
          >
            <Camera className="mr-2 w-4 h-4" /> 
            Start Camera
          </Button>
        ) : (
          <>
            <Button 
              variant="destructive" 
              className="flex-1 h-11"
              onClick={stopCamera}
            >
              <CameraOff className="mr-2 w-4 h-4" /> 
              Stop
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-11"
              onClick={reset}
            >
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Technical Info - Compact */}
      {isActive && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>How it works:</strong> Tracks shoulder landmarks using MediaPipe Pose. 
            All processing happens locally - no data sent to servers.
          </p>
        </div>
      )}
    </div>
  );
};