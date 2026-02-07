# MediaPipe Breathing Detection System - Implementation Guide

## Overview

This is a fully client-side breathing detection system built with MediaPipe Pose, React, and TypeScript. It tracks shoulder movement to detect breathing patterns in real-time without requiring any backend processing.

## Key Features

### 1. **Precise Landmark Tracking**
- Uses MediaPipe Pose to track left shoulder (landmark 11) and right shoulder (landmark 12)
- Normalized coordinates (0-1 range) independent of camera distance
- Robust detection even in varying lighting conditions

### 2. **Temporal Analysis with Sliding Window**
- Maintains a 60-frame sliding window (~2 seconds at 30fps)
- Compares trends over time rather than single-frame differences
- Uses linear regression to calculate movement trend (slope)

### 3. **Exponential Smoothing**
- Alpha value of 0.3 balances responsiveness and stability
- Filters out jitter and noise from camera shake
- Formula: `smoothed = α × raw + (1 - α) × previous_smoothed`

### 4. **Automatic Calibration**
- 3-second calibration phase (90 frames) at startup
- Uses median of collected values for robust baseline
- Adapts to different users, body types, and camera positions

### 5. **Adaptive Thresholds**
- Dynamically adjusts based on observed breathing amplitude
- Minimum threshold of 0.5% of frame height
- Scales with user's natural breathing range (25% of observed range)

### 6. **False Positive Rejection**
- Validates both shoulders move together (asymmetry check)
- Rejects sudden spikes and irregular movements
- Requires consistent trend over multiple frames
- 1.5-second cooldown between breath detections

### 7. **Real-time Visualization**
- Color-coded shoulder line (blue=inhale, green=exhale, amber=hold, gray=calibrating)
- Baseline reference line overlay
- Phase indicator text on video
- Live debug values display

### 8. **Breathing Metrics**
- Breath count tracking
- Breathing rate calculation (breaths per minute)
- Phase detection (inhale/exhale/hold/calibrating)

## Technical Implementation

### Breathing Detection Algorithm

```
1. Extract shoulder Y-coordinates (normalized 0-1)
2. Calculate average: avgY = (leftY + rightY) / 2
3. Validate symmetry: reject if |leftY - rightY| > 30% of shoulder width
4. Add to sliding window (keep last 60 frames)
5. Apply exponential smoothing with α=0.3
6. During calibration (90 frames): establish baseline using median
7. After calibration:
   - Calculate movement = smoothed - baseline
   - Calculate trend using linear regression on last 15 frames
   - Update adaptive threshold based on observed range
   - Detect inhale: movement < -threshold AND trend < -0.0002
   - Detect exhale: movement > threshold AND trend > 0.0002 AND previous phase was inhale
   - Detect hold: |movement| < threshold/2 AND |trend| < 0.0001
```

### Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Sliding window size | 60 frames | ~2 seconds of history |
| Calibration frames | 90 frames | ~3 seconds for baseline |
| Smoothing alpha | 0.3 | Balance between noise reduction and responsiveness |
| Base threshold | 0.5% frame height | Minimum detectable movement |
| Adaptive threshold | 25% of observed range | Scales with breathing amplitude |
| Trend threshold | ±0.0002 | Minimum slope for phase detection |
| Breath cooldown | 1500ms | Prevents double-counting |
| Asymmetry limit | 30% shoulder width | Rejects sideways motion |

## Usage Instructions

### For Users

1. **Setup**
   - Sit upright with shoulders visible to camera
   - Ensure good lighting
   - Position camera at chest/shoulder level
   - Keep camera stable (no handheld)

2. **Calibration**
   - Click "Start Camera" and allow camera access
   - Stay completely still for 3 seconds
   - Wait for "Calibration Complete" message

3. **Breathing Exercise**
   - Breathe slowly and deeply through your nose
   - Inhale: shoulders rise (blue indicator)
   - Exhale: shoulders drop (green indicator)
   - Watch breath count increase with each complete cycle

4. **Tips for Best Results**
   - Breathe naturally - don't exaggerate movements
   - Keep upper body still (no leaning or turning)
   - Maintain consistent posture throughout session
   - Use "Reset Session" if you move significantly

### For Developers

#### Integration

```tsx
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";

function App() {
  return (
    <div>
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

#### Dependencies

Already installed in package.json:
- `@mediapipe/pose` - Pose estimation model
- `@mediapipe/camera_utils` - Camera utilities
- `@mediapipe/drawing_utils` - Visualization helpers

#### Customization

**Adjust sensitivity:**
```typescript
// In detectBreathing function
const baseThreshold = Math.max(0.005, observedRange * 0.25);
// Increase 0.25 to 0.35 for less sensitive (larger movements required)
// Decrease to 0.15 for more sensitive (smaller movements detected)
```

**Change smoothing:**
```typescript
// In detectBreathing function
const alpha = 0.3;
// Increase to 0.5 for more responsive (less smooth)
// Decrease to 0.1 for smoother (less responsive)
```

**Modify calibration time:**
```typescript
// In detectBreathing function
if (calibrationFramesRef.current >= 90) {
// Change 90 to 60 for 2-second calibration
// Change to 120 for 4-second calibration
```

## Performance Optimization

### Lightweight Design
- Model complexity: 1 (balanced speed/accuracy)
- No segmentation (faster processing)
- Canvas rendering only (no heavy DOM updates)
- Efficient sliding window with array operations

### Browser Compatibility
- Works in all modern browsers with WebRTC support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported (iOS Safari, Chrome Mobile)

### Privacy-Friendly
- 100% client-side processing
- No data sent to servers
- No video recording or storage
- Camera access only while active

## Troubleshooting

### Issue: No breaths detected
**Solutions:**
- Ensure shoulders are clearly visible
- Breathe more deeply (but naturally)
- Check lighting - avoid backlighting
- Reset and recalibrate
- Adjust sensitivity parameters

### Issue: False positives
**Solutions:**
- Stay more still during breathing
- Avoid head movements
- Ensure camera is stable
- Increase threshold multiplier (0.25 → 0.35)

### Issue: Calibration fails
**Solutions:**
- Stay completely still for full 3 seconds
- Ensure good pose detection (shoulders visible)
- Check camera angle and lighting
- Try resetting and starting again

### Issue: Inconsistent detection
**Solutions:**
- Maintain consistent posture
- Breathe at steady pace
- Avoid clothing that obscures shoulders
- Ensure stable camera position

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌─────────────────┐            │
│  │   Webcam     │─────▶│  MediaPipe Pose │            │
│  │   Stream     │      │   (WASM Model)  │            │
│  └──────────────┘      └────────┬────────┘            │
│                                  │                      │
│                                  ▼                      │
│                        ┌─────────────────┐             │
│                        │  33 Landmarks   │             │
│                        │  (Normalized)   │             │
│                        └────────┬────────┘             │
│                                  │                      │
│                                  ▼                      │
│                    ┌──────────────────────┐            │
│                    │  Shoulder Extraction │            │
│                    │  (Landmarks 11, 12)  │            │
│                    └──────────┬───────────┘            │
│                                │                        │
│                                ▼                        │
│              ┌─────────────────────────────┐           │
│              │   Breathing Detection       │           │
│              │   - Sliding Window          │           │
│              │   - Exponential Smoothing   │           │
│              │   - Trend Analysis          │           │
│              │   - Adaptive Thresholds     │           │
│              └──────────┬──────────────────┘           │
│                         │                               │
│                         ▼                               │
│              ┌──────────────────────┐                  │
│              │   React UI Update    │                  │
│              │   - Phase Display    │                  │
│              │   - Breath Count     │                  │
│              │   - Visualization    │                  │
│              └──────────────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Future Enhancements

### Potential Improvements
1. **Guided Breathing Exercises**
   - Visual/audio cues for breathing pace
   - Preset patterns (4-7-8, box breathing)
   - Progress tracking over sessions

2. **Advanced Analytics**
   - Breathing variability metrics
   - Session history and trends
   - Export data for analysis

3. **Multi-user Support**
   - Save calibration profiles
   - Compare sessions
   - Group exercises

4. **Enhanced Visualization**
   - Real-time breathing waveform graph
   - 3D shoulder movement visualization
   - Breathing rhythm animations

5. **Accessibility Features**
   - Audio feedback for visually impaired
   - Keyboard controls
   - Screen reader support

## License & Credits

Built with:
- MediaPipe Pose by Google
- React + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui

Perfect for:
- Mental wellness apps
- Meditation guides
- Stress management tools
- Breathing exercise trainers
- Student hackathon projects

## Support

For issues or questions:
1. Check console logs for debug information
2. Verify camera permissions in browser
3. Test with different lighting conditions
4. Review troubleshooting section above
5. Adjust sensitivity parameters as needed

---

**Built with ❤️ for mental wellness and mindful breathing**
