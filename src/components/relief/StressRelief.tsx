import { Card } from "@/components/ui/card";
import { Brain, Heart, Zap, Clock, Headphones, Wind } from "lucide-react";

const stressTechniques = [
  {
    icon: Wind,
    title: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.",
    duration: "2 minutes",
    steps: [
      "Sit comfortably with your back straight",
      "Exhale completely through your mouth",
      "Inhale through nose for 4 counts",
      "Hold your breath for 7 counts", 
      "Exhale through mouth for 8 counts",
      "Repeat cycle 3 more times"
    ]
  },
  {
    icon: Brain,
    title: "Progressive Muscle Relaxation",
    description: "Tense and release muscle groups to reduce physical stress.",
    duration: "10 minutes",
    steps: [
      "Start with your toes, tense for 5 seconds",
      "Release and notice the relaxation",
      "Move up to calves, thighs, abdomen",
      "Continue with arms, shoulders, face",
      "Hold each tension for 5 seconds",
      "Focus on the contrast between tension and relaxation"
    ]
  },
  {
    icon: Heart,
    title: "5-4-3-2-1 Grounding",
    description: "Use your senses to ground yourself in the present moment.",
    duration: "3 minutes",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
      "Take deep breaths between each step"
    ]
  },
  {
    icon: Headphones,
    title: "Guided Visualization",
    description: "Imagine a peaceful place to calm your mind.",
    duration: "5 minutes",
    steps: [
      "Close your eyes and breathe deeply",
      "Imagine your favorite peaceful place",
      "Notice the colors, sounds, and smells",
      "Feel yourself becoming more relaxed",
      "Stay in this place for a few minutes",
      "Slowly return to the present when ready"
    ]
  }
];

export const StressRelief = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Stress Relief Techniques
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Quick and effective techniques to help you manage stress and find calm in challenging moments.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {stressTechniques.map((technique, index) => (
          <Card key={technique.title} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
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

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
        <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          Quick Stress Relief Tips
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm text-blue-800">
          <div className="bg-white/60 rounded-lg p-4">
            <strong>Take a walk</strong><br />
            Even 5 minutes of movement can reduce stress hormones
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <strong>Listen to music</strong><br />
            Calming music can lower blood pressure and reduce anxiety
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <strong>Call a friend</strong><br />
            Social support is one of the best stress relievers
          </div>
        </div>
      </div>
    </div>
  );
};