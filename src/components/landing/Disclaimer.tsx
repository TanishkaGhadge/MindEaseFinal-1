import { AlertCircle } from "lucide-react";

export const Disclaimer = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-coral-100 text-coral-400 mb-6">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Important Notice
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            MindEase is designed to provide emotional support and is <strong>not a replacement for professional 
            medical or mental health care</strong>. If you are experiencing a mental health crisis or emergency, 
            please contact a mental health professional, call a crisis hotline, or go to your nearest emergency room.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-sage-50 border border-sage-200">
            <p className="text-sm text-sage-700">
              <strong>Crisis Resources:</strong> National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
