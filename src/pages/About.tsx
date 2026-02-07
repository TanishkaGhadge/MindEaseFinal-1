import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MessageCircle, Activity, Shield, Users } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Chatbot Support",
    description: "24/7 empathetic conversations with our intelligent chatbot trained in mental health support.",
  },
  {
    icon: Activity,
    title: "Guided Exercises",
    description: "Interactive breathing exercises, meditation, and mindfulness practices tailored to your needs.",
  },
  {
    icon: Users,
    title: "Professional Resources",
    description: "Access to helpline numbers, crisis support, and connections to mental health professionals.",
  },
  {
    icon: Shield,
    title: "Safe & Confidential",
    description: "Your privacy is our priority. All conversations are secure and confidential.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-6 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About MindEase
            </h1>
            <p className="text-xl text-muted-foreground">
              A comprehensive mental health platform designed to provide accessible, 
              compassionate support for everyone.
            </p>
          </div>
        </div>

        {/* Mission Section - Horizontal Layout */}
        <div className="bg-secondary/30 py-16 mb-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To create a safe, welcoming space where you can find the tools, 
                  resources, and guidance needed to improve your mental wellness and build resilience.
                </p>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mental health support should be available to everyone, anytime, 
                  anywhere. We combine professional resources with AI-powered guidance.
                </p>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Approach</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We provide accessible, compassionate support for individuals dealing with 
                  anxiety, stress, depression, and other emotional challenges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - Horizontal Cards */}
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What We Offer
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-soft transition-all text-center"
              >
                <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
