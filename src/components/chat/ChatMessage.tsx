import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  detected_mood?: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  // Remove the mood JSON from displayed content
  const displayContent = message.content.replace(/\[MOOD:\{.*?\}\]/g, '').trim();

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}>
      {/* Avatar */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-lavender-100 text-lavender-500' 
          : 'gradient-calm'
      }`}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <span className="text-lg">💚</span>
        )}
      </div>

      {/* Message bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-card shadow-card border border-border rounded-tl-sm'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{displayContent}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}
        
        {/* Mood indicator for assistant messages */}
        {!isUser && message.detected_mood && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Detected mood: <span className="text-sage-600 font-medium">{message.detected_mood}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
