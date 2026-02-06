import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-calm flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-medium text-foreground">MindEase</span>
          </div>
          
          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-primary transition-colors">Get Started</Link>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <span className="text-muted-foreground/50">Privacy Policy</span>
            <span className="text-muted-foreground/50">Terms of Service</span>
          </nav>

          <p className="text-sm text-muted-foreground">
            Made with 💚 for your well-being
          </p>
        </div>
      </div>
    </footer>
  );
};
