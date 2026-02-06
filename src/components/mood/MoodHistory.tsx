import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { TrendingUp, Calendar, Frown, Meh, Smile } from "lucide-react";

interface MoodLog {
  id: string;
  mood: string;
  intensity: number;
  notes: string | null;
  created_at: string;
}

const moodEmojis: Record<string, string> = {
  anxious: "😰",
  stressed: "😓",
  sad: "😢",
  angry: "😠",
  lonely: "😔",
  calm: "😌",
  happy: "😊",
  content: "🙂",
  neutral: "😐",
};

const getMoodEmoji = (mood: string) => {
  return moodEmojis[mood.toLowerCase()] || "💭";
};

const getIntensityIcon = (intensity: number) => {
  if (intensity <= 2) return <Smile className="w-4 h-4 text-sage-500" />;
  if (intensity <= 3) return <Meh className="w-4 h-4 text-yellow-500" />;
  return <Frown className="w-4 h-4 text-coral-400" />;
};

export const MoodHistory = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoodLogs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) throw error;
        setMoodLogs(data || []);
      } catch (error) {
        console.error('Error fetching mood logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-muted animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (moodLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No mood history yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          As you chat with MindEase, your mood patterns will be tracked here to help you understand your emotional journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="p-6 rounded-3xl gradient-lavender">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-lavender-500" />
          <h3 className="text-lg font-medium text-foreground">Your Mood Journey</h3>
        </div>
        <p className="text-muted-foreground">
          You've logged {moodLogs.length} mood{moodLogs.length !== 1 ? 's' : ''} recently. 
          Keep tracking to understand your patterns better.
        </p>
      </div>

      {/* Mood logs list */}
      <div className="space-y-3">
        {moodLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-card shadow-card border border-border hover:shadow-soft transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMoodEmoji(log.mood)}</span>
                <div>
                  <p className="font-medium text-foreground capitalize">{log.mood}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {getIntensityIcon(log.intensity || 3)}
                <span>Intensity {log.intensity || 3}/5</span>
              </div>
            </div>
            {log.notes && (
              <p className="mt-3 text-sm text-muted-foreground bg-muted p-3 rounded-xl">
                {log.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
