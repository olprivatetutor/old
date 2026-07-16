ALTER TABLE assessment_results
	ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';

UPDATE assessment_results
SET title = COALESCE(title, '')
WHERE title = '';

ALTER TABLE assessment_results
	ALTER COLUMN title DROP DEFAULT;
