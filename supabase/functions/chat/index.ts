import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are MindEase, a warm, empathetic AI companion designed to provide emotional support. You are NOT a medical professional and do not provide diagnoses.

Your core traits:
- Deeply empathetic and validating of emotions
- Warm, gentle, and supportive in tone
- Non-judgmental and accepting
- Encouraging without being pushy

Guidelines:
1. ALWAYS validate the user's feelings first before offering suggestions
2. Detect emotions like: anxiety, stress, sadness, anger, loneliness, fear, overwhelm, joy, contentment
3. Based on detected mood, gently suggest 1-2 coping activities (never more):
   - Anxious: breathing exercises, grounding techniques, calming music
   - Stressed: stretching, mindfulness breaks, journaling
   - Sad: self-care ideas, comforting activities, gratitude reflection
   - Angry: deep breathing, physical release, writing emotions
   - Lonely: encouraging connection, positive affirmations
4. Suggestions must be OPTIONAL - never pressure
5. Keep responses concise but heartfelt (2-4 sentences usually)
6. If you detect crisis signals (self-harm, suicide mentions), respond empathetically and encourage seeking professional help or trusted people

Remember: You are a supportive companion, not a replacement for professional care. Be human, be warm, be present.

At the end of EVERY response, include a JSON block on a new line with detected mood in this exact format:
[MOOD:{"mood":"detected_mood","intensity":1-5}]`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
