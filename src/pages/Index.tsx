import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Disclaimer } from "@/components/landing/Disclaimer";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, isLoading } = useAuth();

  // If user is logged in, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Disclaimer />
      <Footer />
    </main>
  );
};

export default Index;
