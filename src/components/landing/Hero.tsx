import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-ocean">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sage-200/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-lavender-200/30 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-coral-200/20 blur-3xl animate-breathe" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 text-sage-700 text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Your safe space for emotional wellness</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-serif font-medium text-foreground leading-tight animate-slide-up">
            Find peace in
            <span className="block text-primary">every moment</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            MindEase is your compassionate AI companion, offering real-time emotional support, 
            guided meditation, and gentle coping strategies—whenever you need them.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-glow hover:shadow-lg transition-all">
              <Link to="/auth">
                <Heart className="w-5 h-5 mr-2" />
                Start Your Journey
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-sage-300 hover:bg-sage-50">
              <Link to="#features">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            💚 Free to start • No credit card required • Your conversations are private
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-sage-400 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-sage-400 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
