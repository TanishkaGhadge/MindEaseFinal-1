import { AlertCircle } from "lucide-react";

export const Disclaimer = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent/20 via-accent/10 to-secondary/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/20 border border-accent/30 mb-8 animate-pulse-gentle">
            <AlertCircle className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-6">
            Important Notice
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            MindEase is designed to provide emotional support and is <strong>not a replacement for professional 
            medical or mental health care</strong>. If you are experiencing a mental health crisis or emergency, 
            please contact a mental health professional, call a crisis hotline, or go to your nearest emergency room.
          </p>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm shadow-soft">
            <p className="text-base text-primary/80 font-medium">
              <strong className="text-primary">Crisis Resources:</strong> National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
