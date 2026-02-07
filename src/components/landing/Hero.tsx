import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating background elements for beach/ocean vibes with sunset orange */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ocean waves - soft teal circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-cyan-400/10 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-orange-400/15 animate-sway" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-emerald-400/20 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-orange-300/12 animate-sway" style={{ animationDelay: '6s' }}></div>
        {/* Additional tropical elements with sunset colors */}
        <div className="absolute top-1/3 right-10 w-16 h-16 rounded-full bg-coral-400/12 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-20 w-20 h-20 rounded-full bg-orange-200/15 animate-sway" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge with sunset orange accent */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400/15 via-teal-400/15 to-cyan-400/15 backdrop-blur-sm border border-orange-300/30 text-orange-700 text-sm font-medium animate-fade-in shadow-soft">
            <Sparkles className="w-4 h-4 animate-pulse-gentle text-orange-500" />
            <span>Your safe space for emotional wellness</span>
          </div>

          {/* Main heading with sunset gradient */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-slide-up">
            Find peace in
            <span className="block text-transparent bg-gradient-to-r from-orange-500 via-teal-500 to-cyan-500 bg-clip-text animate-breathe">
              every moment
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            MindEase is your compassionate AI companion, offering real-time emotional support, 
            guided meditation, and gentle coping strategies—whenever you need them.
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="suede-button px-8 py-6 text-lg rounded-2xl shadow-warm hover:shadow-glow transition-all duration-300">
              <Link to="/auth">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-sm text-muted-foreground pt-8 animate-fade-in opacity-80" style={{ animationDelay: '0.4s' }}>
            ✓ Free to start • No credit card required • Your conversations are private
          </p>
        </div>
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none"></div>
    </section>
  );
};
