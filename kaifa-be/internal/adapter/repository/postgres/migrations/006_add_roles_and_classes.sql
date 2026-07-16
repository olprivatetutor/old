ALTER TABLE users
	ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';

ALTER TABLE users
	ADD COLUMN IF NOT EXISTS class text NOT NULL DEFAULT '';

ALTER TABLE syllabi
	ADD COLUMN IF NOT EXISTS class text NOT NULL DEFAULT 'IX';

UPDATE users SET role = 'student' WHERE role = '';
UPDATE users SET class = 'IX' WHERE role = 'student' AND class = '';
UPDATE users SET class = 'XII' WHERE id = 'stdnt0002';
