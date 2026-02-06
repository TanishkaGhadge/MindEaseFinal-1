import { MessageCircleHeart, Brain, Music, Quote, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: MessageCircleHeart,
    title: "Empathetic AI Chat",
    description: "Talk to an AI companion that truly listens, validates your feelings, and responds with warmth and understanding.",
    gradient: "gradient-calm",
  },
  {
    icon: Brain,
    title: "Real-time Mood Detection",
    description: "Our AI detects your emotional state and adapts its responses to provide the most helpful support.",
    gradient: "gradient-lavender",
  },
  {
    icon: Music,
    title: "Meditation Toolkit",
    description: "Access calming Om chanting, soothing flute music, and guided breathing exercises anytime.",
    gradient: "gradient-sunrise",
  },
  {
    icon: Quote,
    title: "Daily Inspiration",
    description: "Start each day with uplifting quotes and affirmations to nurture your mental strength.",
    gradient: "gradient-calm",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your conversations are encrypted and private. We never share your personal data.",
    gradient: "gradient-lavender",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "MindEase is here for you whenever you need support—day or night, no appointments needed.",
    gradient: "gradient-sunrise",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-4">
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
              className="group p-8 rounded-3xl bg-card shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
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
