import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, Timer, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SoundType = "omkar" | "flute" | null;
type TimerDuration = 2 | 5 | 10 | null;

// Using royalty-free meditation sounds
const SOUNDS = {
  omkar: "https://assets.mixkit.co/music/preview/mixkit-meditation-ambient-nature-sounds-2493.mp3",
  flute: "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3",
};

export const MeditationToolkit = () => {
  const [currentSound, setCurrentSound] = useState<SoundType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [selectedTimer, setSelectedTimer] = useState<TimerDuration>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const playSound = (sound: SoundType) => {
    if (!sound) return;

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const audio = new Audio(SOUNDS[sound]);
    audio.loop = true;
    audio.volume = volume[0] / 100;
    audioRef.current = audio;
    
    audio.play().then(() => {
      setCurrentSound(sound);
      setIsPlaying(true);

      // Start timer if selected
      if (selectedTimer) {
        const totalSeconds = selectedTimer * 60;
        setTimeRemaining(totalSeconds);
        
        timerRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev === null || prev <= 1) {
              stopSound();
              toast({
                title: "Meditation complete 🧘",
                description: "Great job taking time for yourself!",
              });
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }).catch(() => {
      toast({
        title: "Could not play audio",
        description: "Please check your audio settings and try again.",
        variant: "destructive",
      });
    });
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentSound(null);
    setIsPlaying(false);
    setTimeRemaining(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-card shadow-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full gradient-lavender flex items-center justify-center">
          <Music className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-serif font-medium text-foreground">Relax & Meditate</h3>
          <p className="text-sm text-muted-foreground">Find your inner peace</p>
        </div>
      </div>

      {/* Visualization */}
      {isPlaying && (
        <div className="relative h-40 mb-6 rounded-2xl gradient-ocean flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-sage-300/30 animate-breathing" />
            <div className="absolute w-24 h-24 rounded-full bg-sage-400/40 animate-breathing" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-16 h-16 rounded-full bg-sage-500/50 animate-breathing" style={{ animationDelay: '1s' }} />
          </div>
          {timeRemaining !== null && (
            <div className="relative z-10 text-center">
              <p className="text-3xl font-medium text-sage-700">{formatTime(timeRemaining)}</p>
              <p className="text-sm text-sage-600">remaining</p>
            </div>
          )}
        </div>
      )}

      {/* Sound selection */}
      <div className="space-y-4 mb-6">
        <p className="text-sm font-medium text-foreground">Choose your sound</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={currentSound === "omkar" ? "default" : "outline"}
            onClick={() => playSound("omkar")}
            className="h-auto py-4 flex flex-col gap-2 rounded-2xl"
          >
            <span className="text-2xl">🕉️</span>
            <span>Om Chanting</span>
          </Button>
          <Button
            variant={currentSound === "flute" ? "default" : "outline"}
            onClick={() => playSound("flute")}
            className="h-auto py-4 flex flex-col gap-2 rounded-2xl"
          >
            <span className="text-2xl">🎶</span>
            <span>Calming Flute</span>
          </Button>
        </div>
      </div>

      {/* Timer selection */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Timer className="w-4 h-4" />
          <span>Set timer (optional)</span>
        </div>
        <div className="flex gap-2">
          {([2, 5, 10] as TimerDuration[]).map((duration) => (
            <Button
              key={duration}
              variant={selectedTimer === duration ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimer(selectedTimer === duration ? null : duration)}
              className="rounded-full"
            >
              {duration} min
            </Button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {!isPlaying && currentSound && (
            <Button onClick={resumeSound} size="icon" className="rounded-full">
              <Play className="w-5 h-5" />
            </Button>
          )}
          {isPlaying && (
            <Button onClick={pauseSound} variant="outline" size="icon" className="rounded-full">
              <Pause className="w-5 h-5" />
            </Button>
          )}
          {currentSound && (
            <Button onClick={stopSound} variant="outline" size="icon" className="rounded-full">
              <Square className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
        </div>
      </div>
    </div>
  );
};
