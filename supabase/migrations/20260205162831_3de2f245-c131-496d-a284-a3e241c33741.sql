-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mood_logs table for tracking mood history
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for storing conversations
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  detected_mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create motivational_quotes table
CREATE TABLE public.motivational_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivational_quotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Mood logs policies
CREATE POLICY "Users can view their own mood logs" 
ON public.mood_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood logs" 
ON public.mood_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs" 
ON public.mood_logs FOR DELETE 
USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own messages" 
ON public.chat_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages FOR DELETE 
USING (auth.uid() = user_id);

-- Motivational quotes are public read
CREATE POLICY "Anyone can view quotes" 
ON public.motivational_quotes FOR SELECT 
USING (true);

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some motivational quotes
INSERT INTO public.motivational_quotes (quote, author, category) VALUES
('You are stronger than you think and braver than you believe.', 'A.A. Milne', 'strength'),
('Every day is a fresh start. Take a deep breath and begin again.', 'Unknown', 'hope'),
('Your feelings are valid. It''s okay to not be okay sometimes.', 'Unknown', 'validation'),
('Small steps every day lead to big changes over time.', 'Unknown', 'progress'),
('You deserve the same kindness you give to others.', 'Unknown', 'self-care'),
('This too shall pass. Better days are coming.', 'Persian Proverb', 'hope'),
('You are not alone in your struggles. Many share your journey.', 'Unknown', 'connection'),
('Healing is not linear. Be patient with yourself.', 'Unknown', 'healing'),
('Your mental health matters. Taking breaks is not weakness.', 'Unknown', 'self-care'),
('Even the darkest night will end and the sun will rise.', 'Victor Hugo', 'hope'),
('You are worthy of love, belonging, and peace.', 'Brené Brown', 'validation'),
('Progress, not perfection, is what matters.', 'Unknown', 'progress'),
('Be gentle with yourself. You''re doing the best you can.', 'Unknown', 'self-compassion'),
('Every storm runs out of rain.', 'Maya Angelou', 'hope'),
('Your story isn''t over yet. Keep writing.', 'Unknown', 'strength');