import { Navigate, Routes, Route, useNavigate } from "react-router-dom";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MeditationToolkit } from "@/components/meditation/MeditationToolkit";
import { BreathingExercise } from "@/components/breathing/BreathingExercise";
import { MotivationalQuote } from "@/components/quotes/MotivationalQuote";
import { MoodHistory } from "@/components/mood/MoodHistory";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-5rem)]">
      {/* Chat takes up 2 columns on large screens */}
      <div className="lg:col-span-2 rounded-3xl bg-card shadow-card border border-border overflow-hidden">
        <ChatInterface />
      </div>
      
      {/* Sidebar with quote */}
      <div className="space-y-6">
        <MotivationalQuote />
        <BreathingExercise />
      </div>
    </div>
  );
};

const MeditatePage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">
          Relax & Meditate
        </h1>
        <p className="text-muted-foreground">
          Take a moment to find your inner peace
        </p>
      </div>
      <MeditationToolkit />
      <BreathingExercise />
    </div>
  );
};

const HistoryPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">
          Mood History
        </h1>
        <p className="text-muted-foreground">
          Track your emotional journey over time
        </p>
      </div>
      <MoodHistory />
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-medium text-foreground mb-2">
          Your Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      <div className="bg-card rounded-3xl shadow-card border border-border p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full gradient-calm flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💚</span>
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">
            {user?.email?.split('@')[0]}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onSignOut={handleSignOut} />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/meditate" element={<MeditatePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
