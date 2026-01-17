-- MVP2: Idea Storage Schema
-- Run this in Supabase SQL Editor

-- Ideas table for storing generated business ideas
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

-- Core idea content
title TEXT NOT NULL,
problem_title TEXT,
problem_source TEXT, -- 'xprize', 'sdg', 'wef', 'yc_rfs'
domain TEXT, -- 'climate', 'health', 'ai_safety', etc.
job_story TEXT,

-- Business model & execution
business_model TEXT,
technology TEXT,
target_market TEXT,
revenue_model TEXT,

-- Validation metrics (populated in MVP2)
signal_score INTEGER, -- 0-100 viability score
validation_report JSONB, -- Detailed validation data
last_validated_at TIMESTAMPTZ,

-- Metadata
created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation cache to prevent duplicate API calls
CREATE TABLE IF NOT EXISTS validation_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    idea_id UUID REFERENCES ideas (id) ON DELETE CASCADE,
    data_source TEXT NOT NULL, -- 'trends', 'competitors', 'market'
    cached_data JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas (user_id);

CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ideas_signal_score ON ideas (signal_score DESC);

CREATE INDEX IF NOT EXISTS idx_validation_cache_idea ON validation_cache (idea_id);

CREATE INDEX IF NOT EXISTS idx_validation_cache_expires ON validation_cache (expires_at);

-- Row Level Security (RLS) policies
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

ALTER TABLE validation_cache ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own ideas
CREATE POLICY "Users can view own ideas" ON ideas FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own ideas" ON ideas FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own ideas" ON ideas FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid () = user_id);

-- Validation cache policies (users can read cache for their ideas)
CREATE POLICY "Users can view validation cache for own ideas" ON validation_cache FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM ideas
            WHERE
                ideas.id = validation_cache.idea_id
                AND ideas.user_id = auth.uid ()
        )
    );

CREATE POLICY "Users can insert validation cache for own ideas" ON validation_cache FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM ideas
            WHERE
                ideas.id = validation_cache.idea_id
                AND ideas.user_id = auth.uid ()
        )
    );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on ideas table
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Cleanup expired cache entries (run periodically via cron or manual)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM validation_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;