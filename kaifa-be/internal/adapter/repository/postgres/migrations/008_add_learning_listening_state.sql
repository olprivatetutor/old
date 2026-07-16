ALTER TABLE learning_sessions
	ADD COLUMN IF NOT EXISTS listening_state jsonb NOT NULL DEFAULT 'null'::jsonb;
