ALTER TABLE syllabi
	ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english';

ALTER TABLE modules
	ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english';

ALTER TABLE assessment_sessions
	ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english';

ALTER TABLE learning_sessions
	ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'english';

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_name = 'syllabi'
			AND column_name = 'level'
			AND data_type <> 'ARRAY'
	) THEN
		ALTER TABLE syllabi
			ALTER COLUMN level TYPE text[]
			USING CASE
				WHEN level = 'All Levels' THEN ARRAY['A1','A2','B1','B2','C1','C2']
				WHEN level ILIKE 'Intermediate%Advanced' THEN ARRAY['B1','B2','C1','C2']
				WHEN level ILIKE 'Beginner%Intermediate' THEN ARRAY['A1','A2','B1']
				ELSE ARRAY[level]
			END;
	END IF;
END $$;

UPDATE syllabi SET language = 'english' WHERE language = '';
UPDATE modules SET language = 'english' WHERE language = '';

UPDATE assessment_sessions s
SET language = m.language
FROM modules m
WHERE s.module_id = m.id;

UPDATE learning_sessions s
SET language = m.language
FROM modules m
WHERE s.module_id = m.id;
