ALTER TABLE assessment_results
	ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE assessment_results
SET translations = CASE
	WHEN COALESCE(title_bahasa_indonesia, '') = ''
		AND COALESCE(summary_bahasa_indonesia, '') = ''
		AND COALESCE(strengths_bahasa_indonesia, '[]'::jsonb) = '[]'::jsonb
		AND COALESCE(areas_bahasa_indonesia, '[]'::jsonb) = '[]'::jsonb
	THEN '[]'::jsonb
	ELSE jsonb_build_array(jsonb_build_object(
		'language', 'bahasa indonesia',
		'title', COALESCE(title_bahasa_indonesia, ''),
		'summary', COALESCE(summary_bahasa_indonesia, ''),
		'strengths', COALESCE(strengths_bahasa_indonesia, '[]'::jsonb),
		'areas', COALESCE(areas_bahasa_indonesia, '[]'::jsonb)
	))
END;
