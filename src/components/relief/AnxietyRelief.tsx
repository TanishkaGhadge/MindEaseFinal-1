import { Card } from "@/components/ui/card";
import { Shield, Anchor, Lightbulb, Clock, CheckCircle, AlertCircle } from "lucide-react";

const anxietyTechniques = [
  {
    icon: Anchor,
    title: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold to calm anxiety.",
    duration: "3 minutes",
    steps: [
      "Inhale slowly for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale slowly for 4 counts", 
      "Hold empty for 4 counts",
      "Repeat this cycle 8-10 times",
      "Focus only on counting"
    ]
  },
  {
    icon: Lightbulb,
    title: "Thought Challenging",
    description: "Question anxious thoughts to reduce their power over you.",
    duration: "5 minutes",
    steps: [
      "Write down the anxious thought",
      "Ask: Is this thought realistic?",
      "What evidence supports/contradicts it?",
      "What would I tell a friend?",
      "Rewrite a more balanced thought",
      "Focus on what you can control"
    ]
  },
  {
    icon: Shield,
    title: "Safe Place Visualization",
    description: "Create a mental sanctuary where you feel completely safe.",
    duration: "7 minutes",
    steps: [
      "Close your eyes and breathe deeply",
      "Imagine a place where you feel safe",
      "Add details: colors, textures, sounds",
      "Notice how calm you feel here",
      "Create a mental 'anchor' to return",
      "Practice visiting this place daily"
    ]
  },
  {
    icon: CheckCircle,
    title: "Worry Time Technique",
    description: "Schedule specific time for worries to prevent all-day anxiety.",
    duration: "15 minutes",
    steps: [
      "Set aside 15 minutes daily for worrying",
      "When anxious thoughts arise, note them",
      "Tell yourself 'I'll think about this at worry time'",
      "During worry time, review your list",
      "Problem-solve what you can control",
      "Let go of what you cannot control"
    ]
  }
];

const anxietySymptoms = [
  "Racing thoughts",
  "Rapid heartbeat", 
  "Sweating or trembling",
  "Difficulty concentrating",
  "Feeling restless",
  "Muscle tension"
];

export const AnxietyRelief = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Anxiety Relief Techniques
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Evidence-based techniques to help you manage anxiety and regain control over anxious thoughts and feelings.
        </p>
      </div>

      {/* Anxiety Recognition */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-amber-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Recognizing Anxiety
            </h3>
            <p className="text-amber-800 mb-4">
              Anxiety often shows up in both physical and mental ways. Common signs include:
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {anxietySymptoms.map((symptom, index) => (
                <div key={index} className="flex items-center gap-2 text-amber-800">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm">{symptom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {anxietyTechniques.map((technique, index) => (
          <Card key={technique.title} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
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

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
        <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Remember: You Are Safe
        </h3>
        <p className="text-green-800 mb-6">
          Anxiety tricks us into thinking we're in danger when we're actually safe. 
          These feelings are temporary and will pass.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-green-800">
          <div className="bg-white/60 rounded-lg p-4">
            <strong>This feeling will pass</strong><br />
            Anxiety peaks and then naturally decreases
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <strong>You've survived this before</strong><br />
            You have the strength to get through this
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <strong>Focus on now</strong><br />
            Anxiety lives in the future - stay present
          </div>
        </div>
      </div>
    </div>
  );
};