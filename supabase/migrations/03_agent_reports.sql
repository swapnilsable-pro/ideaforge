-- MVP4: Multi-Agent System - Agent Reports Schema
-- Stores analysis reports from specialized AI agents (Researcher, Designer, Validator, GTM)

CREATE TABLE agent_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  agent_role TEXT NOT NULL CHECK (agent_role IN ('researcher', 'designer', 'validator', 'gtm')),

-- Report content
summary TEXT NOT NULL,
  key_insights TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),

-- Metadata
metadata JSONB DEFAULT '{}'::jsonb, execution_time_ms INTEGER,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW() );

-- Multi-agent analysis sessions
CREATE TABLE multi_agent_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,

-- Overall synthesis
synthesis TEXT,

-- Status tracking
status TEXT NOT NULL CHECK (
    status IN (
        'pending',
        'in_progress',
        'complete',
        'error'
    )
) DEFAULT 'pending',
error_message TEXT,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(), completed_at TIMESTAMPTZ );

-- Indexes for fast lookups
CREATE INDEX idx_agent_reports_idea ON agent_reports (idea_id);

CREATE INDEX idx_agent_reports_role ON agent_reports (agent_role);

CREATE INDEX idx_agent_reports_created ON agent_reports (created_at DESC);

CREATE INDEX idx_multi_agent_analyses_idea ON multi_agent_analyses (idea_id);

CREATE INDEX idx_multi_agent_analyses_status ON multi_agent_analyses (status);

CREATE INDEX idx_multi_agent_analyses_created ON multi_agent_analyses (created_at DESC);

-- RLS Policies
ALTER TABLE agent_reports ENABLE ROW LEVEL SECURITY;

ALTER TABLE multi_agent_analyses ENABLE ROW LEVEL SECURITY;

-- Users can view agent reports for their own ideas
CREATE POLICY "Users can view own agent reports" ON agent_reports FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM ideas
            WHERE
                ideas.id = agent_reports.idea_id
                AND ideas.user_id = auth.uid ()
        )
    );

-- Users can view multi-agent analyses for their own ideas
CREATE POLICY "Users can view own analyses" ON multi_agent_analyses FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM ideas
            WHERE
                ideas.id = multi_agent_analyses.idea_id
                AND ideas.user_id = auth.uid ()
        )
    );

-- System can insert agent reports (via API)
CREATE POLICY "System can insert agent reports" ON agent_reports FOR
INSERT
WITH
    CHECK (true);

-- System can insert/update analyses
CREATE POLICY "System can manage analyses" ON multi_agent_analyses FOR ALL USING (true)
WITH
    CHECK (true);