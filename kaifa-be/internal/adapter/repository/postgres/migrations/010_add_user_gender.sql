ALTER TABLE users
	ADD COLUMN IF NOT EXISTS gender text NOT NULL DEFAULT '';

UPDATE users SET gender = 'female' WHERE email = 'aisha@kaifa.com';
UPDATE users SET gender = 'male', class = 'VII' WHERE email = 'umar@kaifa.com';
UPDATE users SET gender = 'male' WHERE email = 'sasuke@konoha.com';
