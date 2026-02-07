import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brain, MessageCircle, Music, History, User, LogOut, Home, Shield, Heart, Zap, ChevronDown, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardNavProps {
  onSignOut?: () => void;
}

const navItems = [
  { icon: MessageCircle, label: "Chat", path: "/dashboard" },
  { icon: Music, label: "Meditate", path: "/dashboard/meditate" },
  { icon: History, label: "Mood History", path: "/dashboard/history" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

const reliefTechniques = [
  { icon: Zap, label: "Stress Relief", path: "/dashboard/stress-relief" },
  { icon: Shield, label: "Anxiety Relief", path: "/dashboard/anxiety-relief" },
  { icon: Heart, label: "Sadness Relief", path: "/dashboard/sadness-relief" },
];

export const DashboardNav = ({ onSignOut }: DashboardNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onSignOut?.();
      toast({
        title: "Signed out",
        description: "Take care of yourself. See you soon!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isReliefActive = reliefTechniques.some(item => location.pathname === item.path);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:block">
              MindEase
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full ${isActive ? '' : 'hover:bg-muted'}`}
                >
                  <Link to={item.path}>
                    <item.icon className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
            
            {/* Relief Techniques Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isReliefActive ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-full ${isReliefActive ? '' : 'hover:bg-muted'}`}
                >
                  <Sparkles className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Relief Techniques</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {reliefTechniques.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted ml-2"
            >
              <Link to="/">
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
