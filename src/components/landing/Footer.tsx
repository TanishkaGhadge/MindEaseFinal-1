import { Brain } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If on home page, scroll to about section
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-16 bg-gradient-to-t from-secondary/40 to-secondary/20 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft animate-breathe-slow">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">MindEase</span>
          </Link>
          
          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-primary transition-colors font-medium">Get Started</Link>
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors font-medium">Features</button>
            <button onClick={handleAboutClick} className="hover:text-primary transition-colors font-medium">About</button>
            <span className="text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer">Terms of Service</span>
          </nav>

          <p className="text-sm text-muted-foreground/80">
            © 2026 MindEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
