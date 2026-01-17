-- Add missing description columns to ideas table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS problem_description TEXT;

ALTER TABLE ideas ADD COLUMN IF NOT EXISTS solution_description TEXT;

-- Update SavedIdea type in your codebase to match this!