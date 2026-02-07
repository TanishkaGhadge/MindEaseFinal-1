import { Card } from "@/components/ui/card";
import { Sun, Heart, Users, BookOpen, Clock, Smile, CloudRain } from "lucide-react";

const sadnessTechniques = [
  {
    icon: Sun,
    title: "Gratitude Practice",
    description: "Shift focus to positive aspects of life, even small ones.",
    duration: "5 minutes",
    steps: [
      "Write down 3 things you're grateful for today",
      "Include one thing about yourself",
      "Include one thing about others",
      "Include one simple pleasure (like coffee)",
      "Read them aloud to yourself",
      "Notice how your mood shifts slightly"
    ]
  },
  {
    icon: Users,
    title: "Connection Ritual",
    description: "Reach out to others to combat isolation and loneliness.",
    duration: "10 minutes",
    steps: [
      "Think of someone who cares about you",
      "Send them a simple message or call",
      "Share how you're feeling if comfortable",
      "Ask about their day",
      "Plan a future activity together",
      "Remember: you are not alone"
    ]
  },
  {
    icon: Heart,
    title: "Self-Compassion Break",
    description: "Treat yourself with the kindness you'd show a good friend.",
    duration: "7 minutes",
    steps: [
      "Place your hand on your heart",
      "Acknowledge: 'This is a moment of suffering'",
      "Remember: 'Suffering is part of life'",
      "Say: 'May I be kind to myself'",
      "Breathe deeply and feel your heartbeat",
      "Offer yourself words of comfort"
    ]
  },
  {
    icon: BookOpen,
    title: "Meaning-Making Journal",
    description: "Find purpose and meaning even in difficult times.",
    duration: "15 minutes",
    steps: [
      "Write about what you're experiencing",
      "Ask: What might this teach me?",
      "How might this help me understand others?",
      "What strengths am I discovering?",
      "How can I use this experience to help?",
      "End with one small step forward"
    ]
  }
];

const moodBoosters = [
  {
    title: "Listen to uplifting music",
    description: "Music can shift our emotional state quickly"
  },
  {
    title: "Do something creative",
    description: "Art, writing, or crafts can be therapeutic"
  },
  {
    title: "Help someone else",
    description: "Acts of kindness boost our own mood"
  },
  {
    title: "Spend time in nature",
    description: "Even looking at trees can improve mood"
  },
  {
    title: "Practice gentle movement",
    description: "Yoga, stretching, or walking releases endorphins"
  },
  {
    title: "Watch something funny",
    description: "Laughter truly is medicine for the soul"
  }
];

export const SadnessRelief = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Sadness Relief & Mood Support
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gentle techniques to help you navigate sadness and gradually lift your mood with compassion and care.
        </p>
      </div>

      {/* Validation Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <CloudRain className="w-8 h-8 text-purple-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Your Feelings Are Valid
            </h3>
            <p className="text-purple-800">
              Sadness is a natural human emotion that serves important purposes. It helps us process loss, 
              connects us to our values, and can deepen our empathy. It's okay to feel sad - you don't need 
              to rush to "fix" it, but these techniques can help you care for yourself during difficult times.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sadnessTechniques.map((technique, index) => (
          <Card key={technique.title} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <technique.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {technique.title}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {technique.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Clock className="w-4 h-4" />
                  <span>{technique.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Steps:</h4>
              <ol className="space-y-1 text-sm text-muted-foreground">
                {technique.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2">
                    <span className="text-primary font-medium min-w-[20px]">
                      {stepIndex + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        ))}
      </div>

      {/* Mood Boosters */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8">
        <div className="text-center mb-6">
          <Smile className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-900 mb-2">
            Gentle Mood Boosters
          </h3>
          <p className="text-yellow-800">
            Small actions that can help lift your spirits, even just a little bit.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moodBoosters.map((booster, index) => (
            <div key={index} className="bg-white/60 rounded-lg p-4 text-center">
              <h4 className="font-medium text-yellow-900 mb-2">{booster.title}</h4>
              <p className="text-sm text-yellow-800">{booster.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8">
        <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-pink-900 mb-4">
          Remember: Healing Takes Time
        </h3>
        <p className="text-pink-800 max-w-2xl mx-auto">
          Be patient and gentle with yourself. Sadness often comes in waves, and that's completely normal. 
          Each small step you take to care for yourself matters, even if you don't feel better immediately.
        </p>
      </div>
    </div>
  );
};