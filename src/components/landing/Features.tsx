import { MessageCircle, Brain, Music, Quote, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Empathetic AI Chat",
    description: "Talk to an AI companion that truly listens, validates your feelings, and responds with warmth and understanding.",
    color: "bg-gradient-to-br from-blue-400 to-blue-500",
  },
  {
    icon: Brain,
    title: "Real-time Mood Detection",
    description: "Our AI detects your emotional state and adapts its responses to provide the most helpful support.",
    color: "bg-gradient-to-br from-purple-400 to-purple-500",
  },
  {
    icon: Music,
    title: "Meditation Toolkit",
    description: "Access calming Om chanting, soothing flute music, and guided breathing exercises anytime.",
    color: "bg-gradient-to-br from-green-400 to-green-500",
  },
  {
    icon: Quote,
    title: "Daily Inspiration",
    description: "Start each day with uplifting quotes and affirmations to nurture your mental strength.",
    color: "bg-gradient-to-br from-orange-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your conversations are encrypted and private. We never share your personal data.",
    color: "bg-gradient-to-br from-indigo-400 to-indigo-500",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "MindEase is here for you whenever you need support—day or night, no appointments needed.",
    color: "bg-gradient-to-br from-teal-400 to-teal-500",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 suede-section">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your wellness companion
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to support your emotional well-being, all in one calming space.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="suede-feature-card group p-8 rounded-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft animate-breathe-slow`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
