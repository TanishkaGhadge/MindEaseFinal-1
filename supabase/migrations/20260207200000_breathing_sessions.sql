-- Create breathing_sessions table
CREATE TABLE IF NOT EXISTS public.breathing_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL,
    breath_count INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    cycles_completed INTEGER DEFAULT 0,
    target_cycles INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own breathing sessions"
    ON public.breathing_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own breathing sessions"
    ON public.breathing_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breathing sessions"
    ON public.breathing_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS breathing_sessions_user_id_idx ON public.breathing_sessions(user_id);
CREATE INDEX IF NOT EXISTS breathing_sessions_created_at_idx ON public.breathing_sessions(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER breathing_sessions_updated_at
    BEFORE UPDATE ON public.breathing_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
