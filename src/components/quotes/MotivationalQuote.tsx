import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuoteData {
  id: string;
  quote: string;
  author: string | null;
  category: string | null;
}

export const MotivationalQuote = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRandomQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(data[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRandomQuote();
  };

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl gradient-sunrise animate-pulse">
        <div className="h-24 bg-coral-200/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="relative p-8 rounded-3xl gradient-sunrise overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-16 h-16 text-coral-400" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-10">
        <Quote className="w-20 h-20 text-coral-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-coral-200 flex items-center justify-center">
            <Quote className="w-5 h-5 text-coral-500" />
          </div>
          <span className="text-sm font-medium text-coral-600">Daily Inspiration</span>
        </div>

        {quote && (
          <div className="space-y-4">
            <blockquote className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
              "{quote.quote}"
            </blockquote>
            {quote.author && (
              <p className="text-sm text-coral-600 font-medium">
                — {quote.author}
              </p>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-6 text-coral-600 hover:text-coral-700 hover:bg-coral-100"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          New Quote
        </Button>
      </div>
    </div>
  );
};
