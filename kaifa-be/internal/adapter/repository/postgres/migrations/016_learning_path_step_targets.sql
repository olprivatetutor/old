ALTER TABLE learning_path_steps
	ADD COLUMN IF NOT EXISTS target jsonb NOT NULL DEFAULT '[]'::jsonb;
