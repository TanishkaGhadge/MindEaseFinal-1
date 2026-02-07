import { Navigate, Routes, Route, useNavigate } from "react-router-dom";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MeditationToolkit } from "@/components/meditation/MeditationToolkit";
import { CameraBreathingExercise } from "@/components/breathing/CameraBreathingExercise";
import { StressRelief } from "@/components/relief/StressRelief";
import { AnxietyRelief } from "@/components/relief/AnxietyRelief";
import { SadnessRelief } from "@/components/relief/SadnessRelief";
import { MotivationalQuote } from "@/components/quotes/MotivationalQuote";
import { MoodHistory } from "@/components/mood/MoodHistory";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, User as UserIcon } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-5rem)]">
      {/* Chat takes up 2 columns on large screens */}
      <div className="lg:col-span-2 rounded-xl bg-card shadow-card border border-border overflow-hidden">
        <ChatInterface />
      </div>
      
      {/* Sidebar with quote only */}
      <div className="space-y-6">
        <MotivationalQuote />
      </div>
    </div>
  );
};

const MeditatePage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 rounded-3xl bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Relax & Meditate
        </h1>
        <p className="text-teal-700">
          Take a moment to find your inner peace with guided exercises
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <MeditationToolkit />
        <CameraBreathingExercise />
      </div>
    </div>
  );
};

const HistoryPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      <div className="bg-card rounded-xl shadow-card border border-border p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
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
          <Route path="/stress-relief" element={<StressRelief />} />
          <Route path="/anxiety-relief" element={<AnxietyRelief />} />
          <Route path="/sadness-relief" element={<SadnessRelief />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
