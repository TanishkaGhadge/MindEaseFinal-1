import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Activity, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    icon: MessageCircle,
    title: "AI Chatbot Support",
    description: "24/7 empathetic conversations",
  },
  {
    icon: Activity,
    title: "Guided Exercises",
    description: "Interactive breathing & meditation",
  },
  {
    icon: Users,
    title: "Professional Resources",
    description: "Access to crisis support",
  },
  {
    icon: Shield,
    title: "Safe & Confidential",
    description: "Your privacy is our priority",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 suede-section">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About MindEase
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              MindEase is a comprehensive mental health platform designed to provide accessible, 
              compassionate support for individuals dealing with anxiety, stress, depression, and 
              other emotional challenges.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="suede-feature-card text-center p-8 rounded-2xl group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300 animate-breathe-slow">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="suede-button border-2 border-primary/30 hover:border-primary/50 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-2xl">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
