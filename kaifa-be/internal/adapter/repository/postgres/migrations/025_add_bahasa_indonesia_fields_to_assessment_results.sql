ALTER TABLE assessment_results
	ADD COLUMN IF NOT EXISTS title_bahasa_indonesia text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS summary_bahasa_indonesia text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS strengths_bahasa_indonesia jsonb NOT NULL DEFAULT '[]'::jsonb,
	ADD COLUMN IF NOT EXISTS areas_bahasa_indonesia jsonb NOT NULL DEFAULT '[]'::jsonb;
