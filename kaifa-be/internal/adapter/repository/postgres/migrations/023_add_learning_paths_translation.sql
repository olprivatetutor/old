CREATE TABLE IF NOT EXISTS learning_paths_translation (
	id text PRIMARY KEY,
	learning_path_id text NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
	language text NOT NULL,
	topic_scope text NOT NULL,
	UNIQUE (learning_path_id, language)
);
