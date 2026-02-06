import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  detected_mood?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";
    let detectedMood: string | undefined;

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      
      // Check for mood marker
      const moodMatch = assistantContent.match(/\[MOOD:\{.*?"mood":"([^"]+)".*?\}\]/);
      if (moodMatch) {
        detectedMood = moodMatch[1];
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, content: assistantContent, detected_mood: detectedMood }
              : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent, detected_mood: detectedMood }];
      });
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            // Incomplete JSON, wait for more data
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save messages to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save user message
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          role: "user",
          content: content,
        });

        // Save assistant message
        if (assistantContent) {
          await supabase.from("chat_messages").insert({
            user_id: user.id,
            role: "assistant",
            content: assistantContent,
            detected_mood: detectedMood,
          });

          // Log mood if detected
          if (detectedMood) {
            await supabase.from("mood_logs").insert({
              user_id: user.id,
              mood: detectedMood,
              intensity: 3,
            });
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Unable to send message",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      // Remove the user message if request failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  return { messages, isLoading, sendMessage };
};
