ALTER TABLE learning_sessions
	ADD COLUMN IF NOT EXISTS path_id text;

UPDATE learning_sessions
SET path_id = COALESCE(
	NULLIF(learning_path->>'id', ''),
	'legacy-' || module_id
)
WHERE path_id IS NULL OR path_id = '';

CREATE TABLE IF NOT EXISTS learning_paths (
	id text PRIMARY KEY,
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	language text NOT NULL,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	level text NOT NULL,
	topic_scope text NOT NULL,
	steps jsonb NOT NULL DEFAULT '[]'::jsonb,
	total_steps integer NOT NULL DEFAULT 0,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

UPDATE learning_sessions
SET learning_path = jsonb_set(learning_path, '{id}', to_jsonb(path_id))
WHERE learning_path IS NOT NULL
	AND learning_path <> 'null'::jsonb
	AND COALESCE(learning_path->>'id', '') = '';

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

ALTER TABLE learning_sessions
	ALTER COLUMN path_id SET NOT NULL;

ALTER TABLE learning_sessions
	DROP CONSTRAINT IF EXISTS learning_sessions_pkey;

ALTER TABLE learning_sessions
	ADD PRIMARY KEY (user_id, path_id);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_module
	ON learning_sessions (user_id, module_id);

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_module
	ON learning_paths (user_id, module_id);

ALTER TABLE learning_sessions
	DROP COLUMN IF EXISTS learning_path;
