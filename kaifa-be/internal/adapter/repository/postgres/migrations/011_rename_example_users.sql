UPDATE users
SET email = 'aisha@kaifa.com',
	full_name = 'aisha',
	updated_at = now()
WHERE id = 'stdnt0004' OR email = 'sakura@konoha.com';

UPDATE users
SET email = 'umar@kaifa.com',
	full_name = 'umar',
	updated_at = now()
WHERE id = 'stdnt0001' OR email = 'naruto@konoha.com';
