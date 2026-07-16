ALTER TABLE assessment_results
	ADD COLUMN IF NOT EXISTS cefr_level text NOT NULL DEFAULT '';

UPDATE assessment_results
SET cefr_level = COALESCE(cefr_level, level, '')
WHERE cefr_level = '';

ALTER TABLE assessment_results
	ALTER COLUMN cefr_level DROP DEFAULT;
