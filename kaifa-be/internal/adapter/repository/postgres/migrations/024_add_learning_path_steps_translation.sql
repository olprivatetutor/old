CREATE TABLE IF NOT EXISTS learning_path_steps_translation (
	id text PRIMARY KEY,
	learning_path_step_id text NOT NULL REFERENCES learning_path_steps(id) ON DELETE CASCADE,
	language text NOT NULL,
	activity text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	topic_scope text NOT NULL,
	UNIQUE (learning_path_step_id, language)
);
