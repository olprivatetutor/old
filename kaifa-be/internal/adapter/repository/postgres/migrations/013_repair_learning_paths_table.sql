CREATE TABLE IF NOT EXISTS learning_paths (
	id text PRIMARY KEY,
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	language text NOT NULL,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	level text NOT NULL,
	topic_scope text NOT NULL,
	topic_scope_romanized text NOT NULL DEFAULT '',
	steps jsonb NOT NULL DEFAULT '[]'::jsonb,
	total_steps integer NOT NULL DEFAULT 0,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'learning_sessions'
			AND column_name = 'learning_path'
	) THEN
		INSERT INTO learning_paths (id, user_id, language, module_id, level, topic_scope, steps, total_steps, created_at, updated_at)
		SELECT
			path_id,
			user_id,
			COALESCE(NULLIF(learning_path->>'language', ''), language),
			COALESCE(NULLIF(learning_path->>'module_id', ''), module_id),
			COALESCE(NULLIF(learning_path->>'level', ''), level),
			COALESCE(NULLIF(learning_path->>'topic_scope', ''), topic_scope),
			COALESCE(learning_path->'steps', '[]'::jsonb),
			CASE
				WHEN COALESCE(learning_path->>'total_steps', '') ~ '^[0-9]+$'
					THEN (learning_path->>'total_steps')::integer
				ELSE 0
			END,
			created_at,
			updated_at
		FROM learning_sessions
		WHERE learning_path IS NOT NULL
			AND learning_path <> 'null'::jsonb
		ON CONFLICT (id) DO NOTHING;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_module
	ON learning_paths (user_id, module_id);

CREATE TABLE IF NOT EXISTS learning_paths_translation (
	id text PRIMARY KEY,
	learning_path_id text NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
	language text NOT NULL,
	topic_scope text NOT NULL,
	UNIQUE (learning_path_id, language)
);

ALTER TABLE learning_sessions
	DROP COLUMN IF EXISTS learning_path;
