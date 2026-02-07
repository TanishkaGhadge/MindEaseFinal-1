# MediaPipe Breathing Detection - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                      (100% Client-Side)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    1. VIDEO INPUT LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  • getUserMedia() API                                            │
│  • 1280x720 resolution (ideal)                                   │
│  • 30 FPS video stream                                           │
│  • Front-facing camera                                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 2. MEDIAPIPE POSE LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  • MediaPipe Pose Model (WASM)                                   │
│  • Model Complexity: 1 (balanced)                                │
│  • Confidence: 0.5 (detection & tracking)                        │
│  • Output: 33 body landmarks                                     │
│  • Normalized coordinates (0-1)                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              3. LANDMARK EXTRACTION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  • Extract Shoulder Landmarks:                                   │
│    - Left Shoulder (landmark 11)                                 │
│    - Right Shoulder (landmark 12)                                │
│  • Calculate average Y-coordinate                                │
│  • Validate shoulder symmetry                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              4. SIGNAL PROCESSING LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  A. Sliding Window Buffer                                        │
│     • Store last 60 frames (~2 seconds)                          │
│     • FIFO queue implementation                                  │
│                                                                   │
│  B. Exponential Smoothing                                        │
│     • Formula: smoothed = α×raw + (1-α)×prev                     │
│     • Alpha (α) = 0.3                                            │
│     • Reduces jitter and noise                                   │
│                                                                   │
│  C. Trend Analysis                                               │
│     • Linear regression on last 15 frames                        │
│     • Calculate slope (trend direction)                          │
│     • Detect consistent movement patterns                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                5. CALIBRATION LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  • Collect 90 frames (~3 seconds)                                │
│  • Calculate median as baseline                                  │
│  • Establish movement range                                      │
│  • Adapt to user's body type & camera position                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              6. BREATHING DETECTION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  A. Calculate Movement                                           │
│     • movement = smoothed_y - baseline                           │
│                                                                   │
│  B. Adaptive Threshold                                           │
│     • Track min/max movement range                               │
│     • threshold = max(0.005, range × 0.25)                       │
│                                                                   │
│  C. Phase Detection                                              │
│     • INHALE: movement < -threshold AND trend < -0.0002          │
│     • EXHALE: movement > threshold AND trend > 0.0002            │
│     • HOLD: |movement| < threshold/2 AND |trend| < 0.0001        │
│                                                                   │
│  D. False Positive Rejection                                     │
│     • Shoulder symmetry check                                    │
│     • Temporal consistency requirement                           │
│     • 1.5-second cooldown between breaths                        │
│     • Spike filtering                                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 7. METRICS CALCULATION LAYER                     │
├─────────────────────────────────────────────────────────────────┤
│  • Breath Count: Increment on each complete cycle                │
│  • Breathing Rate: Calculate BPM from timestamps                 │
│  • Current Phase: Track inhale/exhale/hold state                 │
│  • Debug Values: Raw Y, smoothed Y, baseline                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  8. VISUALIZATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  • Canvas Rendering:                                             │
│    - Video frame                                                 │
│    - Color-coded shoulder line                                   │
│    - Landmark markers                                            │
│    - Baseline reference line                                     │
│    - Phase indicator text                                        │
│                                                                   │
│  • UI Components:                                                │
│    - Breath count display                                        │
│    - Phase indicator badge                                       │
│    - BPM metric                                                  │
│    - Debug panel                                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    9. USER FEEDBACK LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  • Toast Notifications                                           │
│  • Status Messages                                               │
│  • Instructions                                                  │
│  • Error Handling                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
Video Frame
    │
    ▼
MediaPipe Pose
    │
    ├─→ 33 Landmarks
    │
    ▼
Extract Shoulders (11, 12)
    │
    ├─→ Left Y: 0.456
    ├─→ Right Y: 0.462
    │
    ▼
Calculate Average Y
    │
    ├─→ Raw Y: 0.459
    │
    ▼
Validate Symmetry
    │
    ├─→ |Left - Right| < 30% width? ✓
    │
    ▼
Add to Sliding Window
    │
    ├─→ [0.458, 0.459, 0.460, ..., 0.459] (60 values)
    │
    ▼
Apply Exponential Smoothing
    │
    ├─→ Smoothed Y: 0.4592
    │
    ▼
Calculate Trend (Linear Regression)
    │
    ├─→ Trend: -0.00035 (downward)
    │
    ▼
Calculate Movement from Baseline
    │
    ├─→ Movement: -0.0048 (rising shoulders)
    │
    ▼
Compare with Adaptive Threshold
    │
    ├─→ Threshold: 0.0040
    ├─→ Movement < -Threshold? ✓
    ├─→ Trend < -0.0002? ✓
    │
    ▼
Detect Phase: INHALE
    │
    ├─→ Update UI
    ├─→ Change shoulder line color to BLUE
    ├─→ Display "INHALE" text
    │
    ▼
Wait for Exhale
    │
    ├─→ Movement > Threshold? ✓
    ├─→ Previous phase was INHALE? ✓
    ├─→ Cooldown elapsed? ✓
    │
    ▼
Detect Phase: EXHALE
    │
    ├─→ Increment breath count
    ├─→ Update breathing rate
    ├─→ Change shoulder line color to GREEN
    ├─→ Display "EXHALE" text
    │
    ▼
Repeat...
```

## Component Architecture

```
MediaPipeBreathingDetector
│
├─── State Management
│    ├─ UI State (useState)
│    │  ├─ isActive
│    │  ├─ breathCount
│    │  ├─ currentPhase
│    │  ├─ shoulderY
│    │  ├─ smoothedY
│    │  ├─ breathingRate
│    │  └─ isCalibrated
│    │
│    └─ Refs (useRef)
│       ├─ videoRef
│       ├─ canvasRef
│       ├─ poseRef
│       ├─ cameraRef
│       ├─ streamRef
│       ├─ shoulderHistoryRef
│       ├─ smoothedValueRef
│       ├─ baselineRef
│       ├─ calibrationFramesRef
│       ├─ lastPhaseRef
│       ├─ lastBreathTimeRef
│       ├─ breathTimestampsRef
│       └─ movementRangeRef
│
├─── Camera Control
│    ├─ startCamera()
│    ├─ stopCamera()
│    └─ initializeMediaPipe()
│
├─── Processing Pipeline
│    ├─ onPoseResults()
│    ├─ detectBreathing()
│    ├─ calculateTrend()
│    └─ updateBreathingRate()
│
├─── Visualization
│    └─ drawShoulderVisualization()
│
├─── Utilities
│    └─ reset()
│
└─── UI Render
     ├─ Header Card
     ├─ Instructions Card
     ├─ Video Canvas
     ├─ Status Dashboard
     │  ├─ Breath Count Card
     │  ├─ Current Phase Card
     │  └─ Debug Info Card
     ├─ Control Buttons
     └─ Technical Info Card
```

## Algorithm Flow Chart

```
START
  │
  ▼
[Camera Active?] ─No─→ [Show Start Button] ─→ END
  │
  Yes
  ▼
[Get Video Frame]
  │
  ▼
[Run MediaPipe Pose]
  │
  ▼
[Landmarks Detected?] ─No─→ [Skip Frame] ─→ LOOP
  │
  Yes
  ▼
[Extract Shoulders]
  │
  ▼
[Calculate Avg Y]
  │
  ▼
[Shoulders Symmetric?] ─No─→ [Reject Frame] ─→ LOOP
  │
  Yes
  ▼
[Add to History]
  │
  ▼
[Apply Smoothing]
  │
  ▼
[Calibrated?] ─No─→ [Calibration Mode]
  │                    │
  Yes                  ├─ [Collect Frames]
  ▼                    ├─ [90 Frames?] ─No─→ LOOP
[Calculate Movement]   │
  │                    Yes
  ▼                    ├─ [Set Baseline]
[Calculate Trend]      └─→ [Mark Calibrated] ─→ LOOP
  │
  ▼
[Update Range]
  │
  ▼
[Calculate Threshold]
  │
  ▼
[Movement < -Threshold] ─Yes─→ [Trend < -0.0002?] ─Yes─→ [Set INHALE]
  │                                                           │
  No                                                          ▼
  ▼                                                        [Update UI]
[Movement > Threshold] ─Yes─→ [Trend > 0.0002?] ─Yes─→ [Was INHALE?]
  │                                                           │
  No                                                          Yes
  ▼                                                           ▼
[|Movement| < Threshold/2] ─Yes─→ [Set HOLD]          [Cooldown OK?]
  │                                    │                      │
  No                                   ▼                      Yes
  │                                [Update UI]                ▼
  │                                    │                 [Set EXHALE]
  │                                    │                      │
  │                                    │                      ▼
  │                                    │              [Increment Count]
  │                                    │                      │
  │                                    │                      ▼
  │                                    │              [Update BPM]
  │                                    │                      │
  └────────────────────────────────────┴──────────────────────┘
                                       │
                                       ▼
                                  [Update UI]
                                       │
                                       ▼
                                     LOOP
```

## State Transition Diagram

```
                    ┌─────────────┐
                    │ CALIBRATING │
                    └──────┬──────┘
                           │
                    [90 frames collected]
                           │
                           ▼
                    ┌─────────────┐
              ┌────▶│    HOLD     │◀────┐
              │     └──────┬──────┘     │
              │            │             │
              │     [Movement < -T]     │
              │     [Trend < -0.0002]   │
              │            │             │
              │            ▼             │
              │     ┌─────────────┐     │
              │     │   INHALE    │     │
              │     └──────┬──────┘     │
              │            │             │
              │     [Movement > T]      │
              │     [Trend > 0.0002]    │
              │     [Cooldown OK]       │
              │            │             │
              │            ▼             │
              │     ┌─────────────┐     │
              └─────│   EXHALE    │─────┘
                    └─────────────┘
                           │
                    [Breath counted]
                           │
                    [Movement minimal]
                           │
                    [Back to HOLD]

Legend:
  T = Adaptive threshold
  Movement = smoothed_y - baseline
  Trend = slope of last 15 frames
```

## Performance Characteristics

```
┌─────────────────────────────────────────────────────────┐
│                   PERFORMANCE METRICS                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frame Processing Time:                                 │
│  ├─ MediaPipe Pose: ~20-30ms                            │
│  ├─ Landmark Extraction: <1ms                           │
│  ├─ Signal Processing: <1ms                             │
│  ├─ Canvas Rendering: ~5-10ms                           │
│  └─ Total: ~30-40ms per frame                           │
│                                                          │
│  Frame Rate: ~25-30 FPS                                 │
│  Latency: <100ms (3-4 frames)                           │
│                                                          │
│  Memory Usage:                                          │
│  ├─ MediaPipe Model: ~10MB                              │
│  ├─ Video Buffer: ~5MB                                  │
│  ├─ History Arrays: <1KB                                │
│  └─ Total: ~15MB                                        │
│                                                          │
│  CPU Usage: 15-25% (single core)                        │
│  GPU Usage: Minimal (canvas rendering only)             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Try: Start Camera                  │
└────────┬────────────────────────────┘
         │
         ├─→ [Permission Denied]
         │   └─→ Show Error Toast
         │       └─→ Suggest: Check browser settings
         │
         ├─→ [Camera In Use]
         │   └─→ Show Error Toast
         │       └─→ Suggest: Close other apps
         │
         ├─→ [No Camera Found]
         │   └─→ Show Error Toast
         │       └─→ Suggest: Connect camera
         │
         └─→ [Success]
             └─→ Initialize MediaPipe
                 │
                 ├─→ [Model Load Failed]
                 │   └─→ Show Error Toast
                 │       └─→ Suggest: Check internet
                 │
                 └─→ [Success]
                     └─→ Start Detection
                         │
                         ├─→ [No Landmarks]
                         │   └─→ Skip Frame
                         │       └─→ Continue
                         │
                         ├─→ [Asymmetric Shoulders]
                         │   └─→ Reject Frame
                         │       └─→ Continue
                         │
                         └─→ [Valid Detection]
                             └─→ Process Frame
```

## Security & Privacy Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRIVACY LAYERS                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Camera Access                                 │
│  ├─ Browser permission required                         │
│  ├─ User must explicitly allow                          │
│  └─ Can be revoked anytime                              │
│                                                          │
│  Layer 2: Local Processing                              │
│  ├─ All processing in browser                           │
│  ├─ No server communication                             │
│  └─ No external API calls                               │
│                                                          │
│  Layer 3: No Storage                                    │
│  ├─ No video recording                                  │
│  ├─ No frame saving                                     │
│  ├─ No localStorage usage                               │
│  └─ Data cleared on stop                                │
│                                                          │
│  Layer 4: Minimal Data                                  │
│  ├─ Only Y-coordinates stored                           │
│  ├─ 60-frame buffer only                                │
│  ├─ No personally identifiable info                     │
│  └─ No face detection                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   DEPLOYMENT OPTIONS                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Option 1: Static Hosting                               │
│  ├─ Build: npm run build                                │
│  ├─ Deploy: dist/ folder                                │
│  ├─ Platforms: Vercel, Netlify, GitHub Pages            │
│  └─ Cost: Free                                          │
│                                                          │
│  Option 2: Self-Hosted                                  │
│  ├─ Server: Any HTTP server                             │
│  ├─ Requirements: HTTPS (for camera access)             │
│  ├─ Platforms: AWS S3, Azure, DigitalOcean              │
│  └─ Cost: Minimal                                       │
│                                                          │
│  Option 3: Development                                  │
│  ├─ Command: npm run dev                                │
│  ├─ Port: 5173 (default)                                │
│  ├─ Hot reload: Enabled                                 │
│  └─ Cost: Free                                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ High performance (30 FPS)
- ✅ Low latency (<100ms)
- ✅ Privacy-first design
- ✅ Robust detection
- ✅ Easy deployment
- ✅ Scalable solution
