import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, Timer, Music, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SoundType = "omkar" | "flute" | "ocean" | null;
type TimerDuration = 2 | 5 | 10 | null;

// Audio files are in the public/sounds folder
const SOUNDS = {
  omkar: "/sounds/om-chanting.mp3?v=2", // Om chanting meditation - TunePocket Spiritual Om Chant
  flute: "/sounds/flute.mp3", // Relaxing Krishna flute music
  ocean: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", // Ocean waves
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
    <div className="p-6 rounded-3xl bg-gradient-to-br from-green-100 via-teal-50 to-blue-100 border-2 border-green-200 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
          {currentSound === "ocean" ? (
            <Waves className="w-6 h-6 text-white" />
          ) : (
            <Music className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-serif font-medium text-green-800">Relax & Meditate</h3>
          <p className="text-sm text-teal-600">Find your inner peace</p>
        </div>
      </div>

      {/* Visualization */}
      {isPlaying && (
        <div className="relative h-40 mb-6 rounded-2xl bg-gradient-to-br from-blue-200 via-teal-100 to-green-200 flex items-center justify-center overflow-hidden shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-green-300/40 animate-breathing" />
            <div className="absolute w-24 h-24 rounded-full bg-teal-400/50 animate-breathing" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-16 h-16 rounded-full bg-blue-500/60 animate-breathing" style={{ animationDelay: '1s' }} />
          </div>
          {timeRemaining !== null && (
            <div className="relative z-10 text-center">
              <p className="text-3xl font-medium text-green-800">{formatTime(timeRemaining)}</p>
              <p className="text-sm text-teal-700">remaining</p>
            </div>
          )}
        </div>
      )}

      {/* Sound selection */}
      <div className="space-y-4 mb-6">
        <p className="text-sm font-medium text-green-800">Choose your sound</p>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={currentSound === "omkar" ? "default" : "outline"}
            onClick={() => playSound("omkar")}
            className={`h-auto py-4 flex flex-col gap-2 rounded-2xl ${currentSound === "omkar" ? 'bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-orange-300' : 'border-green-200 hover:bg-green-50'}`}
          >
            <span className="text-2xl">🕉️</span>
            <span>Om Chanting</span>
          </Button>
          <Button
            variant={currentSound === "flute" ? "default" : "outline"}
            onClick={() => playSound("flute")}
            className={`h-auto py-4 flex flex-col gap-2 rounded-2xl ${currentSound === "flute" ? 'bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white border-teal-300' : 'border-green-200 hover:bg-green-50'}`}
          >
            <span className="text-2xl">🎶</span>
            <span>Calming Flute</span>
          </Button>
          <Button
            variant={currentSound === "ocean" ? "default" : "outline"}
            onClick={() => playSound("ocean")}
            className={`h-auto py-4 flex flex-col gap-2 rounded-2xl ${currentSound === "ocean" ? 'bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white border-blue-300' : 'border-green-200 hover:bg-green-50'}`}
          >
            <Waves className="w-8 h-8 mx-auto text-blue-500" />
            <span>Ocean Waves</span>
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

