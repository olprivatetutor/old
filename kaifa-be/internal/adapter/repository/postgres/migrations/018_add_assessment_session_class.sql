ALTER TABLE assessment_sessions
	ADD COLUMN IF NOT EXISTS class text NOT NULL DEFAULT '';

UPDATE assessment_sessions s
SET class = COALESCE(u.class, '')
FROM users u
WHERE s.user_id = u.id
	AND s.class = '';
