ALTER TABLE learning_paths
	ADD COLUMN IF NOT EXISTS topic_scope_romanized text NOT NULL DEFAULT '';

ALTER TABLE learning_path_steps
	ADD COLUMN IF NOT EXISTS activity_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS title_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS description_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS topic_scope_romanized text NOT NULL DEFAULT '';
