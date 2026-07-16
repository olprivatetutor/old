ALTER TABLE users
	ADD COLUMN IF NOT EXISTS password_hash text;

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_name = 'users' AND column_name = 'password'
	) THEN
		UPDATE users
		SET password_hash = '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC'
		WHERE password_hash IS NULL OR password_hash = '';
	END IF;
END $$;

ALTER TABLE users
	ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE users
	DROP COLUMN IF EXISTS password;
