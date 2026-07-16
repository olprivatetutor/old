CREATE TABLE IF NOT EXISTS assessment_results (
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	cefr_level text NOT NULL DEFAULT '',
	level text NOT NULL,
	score integer NOT NULL,
	summary text NOT NULL,
	strengths jsonb NOT NULL DEFAULT '[]'::jsonb,
	areas jsonb NOT NULL DEFAULT '[]'::jsonb,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY (user_id, module_id)
);

INSERT INTO assessment_results (user_id, module_id, cefr_level, level, score, summary, strengths, areas, created_at, updated_at)
SELECT
	user_id,
	module_id,
	COALESCE(result->>'cefr_level', result->>'level', ''),
	result->>'level',
	CASE
		WHEN COALESCE(result->>'score', '') ~ '^[0-9]+$'
			THEN (result->>'score')::integer
		ELSE 0
	END,
	COALESCE(result->>'summary', ''),
	COALESCE(result->'strengths', '[]'::jsonb),
	COALESCE(result->'areas', '[]'::jsonb),
	created_at,
	updated_at
FROM assessment_sessions
WHERE completed = true
	AND result IS NOT NULL
	AND result <> 'null'::jsonb
	AND COALESCE(result->>'level', '') <> ''
ON CONFLICT (user_id, module_id) DO UPDATE SET
	cefr_level = EXCLUDED.cefr_level,
	level = EXCLUDED.level,
	score = EXCLUDED.score,
	summary = EXCLUDED.summary,
	strengths = EXCLUDED.strengths,
	areas = EXCLUDED.areas,
	updated_at = now();

CREATE TABLE IF NOT EXISTS learning_path_steps (
	path_id text NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
	step_order integer NOT NULL,
	activity text NOT NULL,
	activity_romanized text NOT NULL DEFAULT '',
	title text NOT NULL,
	title_romanized text NOT NULL DEFAULT '',
	description text NOT NULL,
	description_romanized text NOT NULL DEFAULT '',
	required_time integer NOT NULL DEFAULT 0,
	topic_scope text NOT NULL,
	topic_scope_romanized text NOT NULL DEFAULT '',
	progress integer NOT NULL DEFAULT 0,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY (path_id, step_order)
);

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'learning_paths'
			AND column_name = 'steps'
	) THEN
		INSERT INTO learning_path_steps (path_id, step_order, activity, title, description, required_time, topic_scope, progress)
		SELECT
			lp.id,
			COALESCE((step.value->>'order')::integer, step.ordinality::integer),
			COALESCE(step.value->>'activity', ''),
			COALESCE(step.value->>'title', ''),
			COALESCE(step.value->>'description', ''),
			CASE
				WHEN COALESCE(step.value->>'required_time', '') ~ '^[0-9]+$'
					THEN (step.value->>'required_time')::integer
				ELSE 0
			END,
			COALESCE(step.value->>'topic_scope', lp.topic_scope),
			CASE
				WHEN COALESCE(step.value->>'progress', '') ~ '^[0-9]+$'
					THEN (step.value->>'progress')::integer
				ELSE 0
			END
		FROM learning_paths lp
		CROSS JOIN LATERAL jsonb_array_elements(lp.steps) WITH ORDINALITY AS step(value, ordinality)
		ON CONFLICT (path_id, step_order) DO NOTHING;

		ALTER TABLE learning_paths
			DROP COLUMN IF EXISTS steps;
	END IF;
END $$;
