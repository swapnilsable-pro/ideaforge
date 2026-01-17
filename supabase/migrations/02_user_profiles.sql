-- MVP3: Context-Aware Generator - User Profiles Schema
-- This stores the user's inventory (skills, network, resources) for personalized idea generation

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,

-- Who am I? (Skills & Experience)
skills TEXT[] DEFAULT '{}',                    -- e.g., ['ai_ml', 'web_platform']
  experience JSONB DEFAULT '[]'::jsonb,          -- Free-text experience entries
  expertise TEXT[] DEFAULT '{}',                 -- Domain expertise, e.g., ['fintech', 'health']

-- What do I know? (Domain Knowledge)
industries TEXT[] DEFAULT '{}',                -- Industries worked in
  pain_points TEXT[] DEFAULT '{}',               -- Personal problems observed

-- Who do I know? (Network)
network JSONB DEFAULT '{}'::jsonb,             -- { investors: true, technical_cofounders: false, ... }

-- What do I have? (Resources)
resources JSONB DEFAULT '{}'::jsonb,           -- { budget: 'bootstrap', time: 'full_time', ... }

-- Ikigai Components
passions TEXT[] DEFAULT '{}',                  -- What they love doing
  strengths TEXT[] DEFAULT '{}',                 -- What they're good at
  market_needs TEXT[] DEFAULT '{}',              -- What world needs (their POV)
  monetization_prefs TEXT[] DEFAULT '{}',        -- Preferred business models

-- Metadata
onboarding_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles (user_id);

CREATE INDEX idx_user_profiles_completed ON user_profiles (onboarding_completed);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles FOR
UPDATE USING (auth.uid () = user_id);

-- Update ideas table to track fit scores
ALTER TABLE ideas
ADD COLUMN IF NOT EXISTS ikigai_score JSONB,
ADD COLUMN IF NOT EXISTS fit_analysis JSONB;

-- Create index for fit score queries
CREATE INDEX IF NOT EXISTS idx_ideas_ikigai_score ON ideas ((ikigai_score ->> 'total'));