# MediaPipe Breathing Detection - Code Examples

## Basic Usage

### Simple Integration
```tsx
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";

function App() {
  return (
    <div className="container mx-auto p-4">
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

## Advanced Examples

### Example 1: Guided Breathing Exercise

Create a guided breathing component that uses the detector:

```tsx
import { useState } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function GuidedBreathingExercise() {
  const [exerciseActive, setExerciseActive] = useState(false);
  const [targetBreaths, setTargetBreaths] = useState(10);

  return (
    <div className="space-y-6">
      {!exerciseActive ? (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Guided Breathing</h2>
          <p className="mb-4">Complete {targetBreaths} deep breaths</p>
          <Button onClick={() => setExerciseActive(true)}>
            Start Exercise
          </Button>
        </Card>
      ) : (
        <div>
          <MediaPipeBreathingDetector />
          <Button 
            onClick={() => setExerciseActive(false)}
            className="mt-4"
          >
            End Exercise
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Breathing with Timer

Combine breathing detection with a countdown timer:

```tsx
import { useState, useEffect } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function TimedBreathingSession() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((300 - timeLeft) / 300) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </h2>
          <Progress value={progress} className="mt-2" />
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-full"
        >
          {isActive ? 'Pause' : 'Start'} Session
        </button>
      </Card>
      
      {isActive && <MediaPipeBreathingDetector />}
    </div>
  );
}
```

### Example 3: Breathing Pattern Trainer

Train specific breathing patterns (4-7-8, box breathing, etc.):

```tsx
import { useState } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breathingPatterns = {
  "4-7-8": { inhale: 4, hold: 7, exhale: 8 },
  "box": { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
  "calm": { inhale: 5, exhale: 5 },
  "energize": { inhale: 3, exhale: 6 }
};

function BreathingPatternTrainer() {
  const [pattern, setPattern] = useState<keyof typeof breathingPatterns>("4-7-8");

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Breathing Pattern</h2>
        <Select value={pattern} onValueChange={(v) => setPattern(v as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4-7-8">4-7-8 Relaxation</SelectItem>
            <SelectItem value="box">Box Breathing</SelectItem>
            <SelectItem value="calm">Calm Breathing</SelectItem>
            <SelectItem value="energize">Energizing Breath</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Pattern: {JSON.stringify(breathingPatterns[pattern])}</p>
        </div>
      </Card>
      
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

### Example 4: Breathing Analytics Dashboard

Track and visualize breathing data over time:

```tsx
import { useState, useEffect } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface BreathingSession {
  date: Date;
  duration: number;
  breathCount: number;
  avgRate: number;
}

function BreathingAnalytics() {
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<Date | null>(null);

  const startSession = () => {
    setCurrentSession(new Date());
  };

  const endSession = (breathCount: number, duration: number) => {
    if (!currentSession) return;
    
    const session: BreathingSession = {
      date: currentSession,
      duration,
      breathCount,
      avgRate: (breathCount / duration) * 60
    };
    
    setSessions(prev => [...prev, session]);
    setCurrentSession(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Breathing Analytics</h2>
        
        {sessions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Session History</h3>
            <LineChart width={600} height={300} data={sessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgRate" stroke="#8884d8" />
            </LineChart>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{sessions.length}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + s.breathCount, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Breaths</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + s.avgRate, 0) / sessions.length)
                : 0}
            </p>
            <p className="text-sm text-gray-600">Avg BPM</p>
          </div>
        </div>
      </Card>
      
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

### Example 5: Meditation with Breathing Sync

Sync meditation audio/visuals with detected breathing:

```tsx
import { useState, useEffect, useRef } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";

function MeditationWithBreathing() {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale" | "hold">("hold");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play different sounds based on breathing phase
    if (breathPhase === "inhale" && audioRef.current) {
      audioRef.current.src = "/sounds/inhale.mp3";
      audioRef.current.play();
    } else if (breathPhase === "exhale" && audioRef.current) {
      audioRef.current.src = "/sounds/exhale.mp3";
      audioRef.current.play();
    }
  }, [breathPhase]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-center">
          <div 
            className={`w-32 h-32 mx-auto rounded-full transition-all duration-1000 ${
              breathPhase === "inhale" ? "bg-blue-500 scale-150" :
              breathPhase === "exhale" ? "bg-green-500 scale-75" :
              "bg-gray-300 scale-100"
            }`}
          />
          <p className="mt-4 text-xl font-semibold capitalize">{breathPhase}</p>
        </div>
      </Card>
      
      <audio ref={audioRef} />
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

### Example 6: Stress Level Indicator

Use breathing rate to estimate stress level:

```tsx
import { useState, useEffect } from "react";
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StressLevelMonitor() {
  const [breathingRate, setBreathingRate] = useState(0);
  
  const getStressLevel = (rate: number) => {
    if (rate < 10) return { level: "Very Calm", color: "bg-green-500" };
    if (rate < 14) return { level: "Calm", color: "bg-blue-500" };
    if (rate < 18) return { level: "Normal", color: "bg-yellow-500" };
    if (rate < 22) return { level: "Elevated", color: "bg-orange-500" };
    return { level: "High Stress", color: "bg-red-500" };
  };

  const stress = getStressLevel(breathingRate);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Stress Monitor</h2>
        
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full ${stress.color} flex items-center justify-center mb-4`}>
            <span className="text-white text-2xl font-bold">{breathingRate}</span>
          </div>
          
          <Badge className={stress.color}>
            {stress.level}
          </Badge>
          
          <p className="mt-4 text-sm text-gray-600">
            {breathingRate > 18 
              ? "Try to slow down your breathing"
              : "Your breathing is well-paced"}
          </p>
        </div>
      </Card>
      
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

## Integration with Existing Components

### Add to Meditation Toolkit

```tsx
// In src/components/meditation/MeditationToolkit.tsx
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MeditationToolkit() {
  return (
    <Tabs defaultValue="breathing">
      <TabsList>
        <TabsTrigger value="breathing">Breathing</TabsTrigger>
        <TabsTrigger value="meditation">Meditation</TabsTrigger>
        <TabsTrigger value="sounds">Sounds</TabsTrigger>
      </TabsList>
      
      <TabsContent value="breathing">
        <MediaPipeBreathingDetector />
      </TabsContent>
      
      {/* Other tabs... */}
    </Tabs>
  );
}
```

### Add to Dashboard Widget

```tsx
// Create a compact version for dashboard
import { MediaPipeBreathingDetector } from "@/components/breathing/MediaPipeBreathingDetector";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

export function BreathingWidget() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Wind className="mr-2" />
          Start Breathing Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <MediaPipeBreathingDetector />
      </DialogContent>
    </Dialog>
  );
}
```

## Testing Examples

### Unit Test Example

```typescript
// src/components/breathing/__tests__/MediaPipeBreathingDetector.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MediaPipeBreathingDetector } from "../MediaPipeBreathingDetector";

describe("MediaPipeBreathingDetector", () => {
  it("renders without crashing", () => {
    render(<MediaPipeBreathingDetector />);
    expect(screen.getByText(/Breathing Detection/i)).toBeInTheDocument();
  });

  it("shows start camera button initially", () => {
    render(<MediaPipeBreathingDetector />);
    expect(screen.getByText(/Start Camera/i)).toBeInTheDocument();
  });

  it("displays instructions when not active", () => {
    render(<MediaPipeBreathingDetector />);
    expect(screen.getByText(/Sit upright/i)).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const MediaPipeBreathingDetector = lazy(() => 
  import("@/components/breathing/MediaPipeBreathingDetector").then(module => ({
    default: module.MediaPipeBreathingDetector
  }))
);

function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <MediaPipeBreathingDetector />
    </Suspense>
  );
}
```

### Conditional Loading

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ConditionalBreathing() {
  const [showDetector, setShowDetector] = useState(false);

  return (
    <div>
      {!showDetector ? (
        <Button onClick={() => setShowDetector(true)}>
          Load Breathing Detector
        </Button>
      ) : (
        <MediaPipeBreathingDetector />
      )}
    </div>
  );
}
```

## Styling Customization

### Custom Theme

```tsx
// Wrap in a custom styled container
function ThemedBreathingDetector() {
  return (
    <div className="breathing-detector-theme">
      <style>{`
        .breathing-detector-theme {
          --primary-color: #6366f1;
          --success-color: #10b981;
          --warning-color: #f59e0b;
        }
      `}</style>
      <MediaPipeBreathingDetector />
    </div>
  );
}
```

## Mobile Optimization

### Responsive Layout

```tsx
function ResponsiveBreathing() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-full md:max-w-4xl lg:max-w-6xl mx-auto">
        <MediaPipeBreathingDetector />
      </div>
    </div>
  );
}
```

---

These examples demonstrate various ways to integrate and extend the MediaPipe breathing detection system. Mix and match based on your needs!
