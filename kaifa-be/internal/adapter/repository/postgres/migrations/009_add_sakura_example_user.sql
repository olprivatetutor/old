INSERT INTO users (id, email, full_name, dob, role, class, current_proficiency_level, password_hash)
VALUES
	('stdnt0004', 'aisha@kaifa.com', 'aisha', '2018-03-28', 'student', 'VII', 'A1', '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC')
ON CONFLICT (id) DO UPDATE SET
	email = EXCLUDED.email,
	full_name = EXCLUDED.full_name,
	dob = EXCLUDED.dob,
	role = EXCLUDED.role,
	class = EXCLUDED.class,
	current_proficiency_level = EXCLUDED.current_proficiency_level,
	password_hash = EXCLUDED.password_hash,
	updated_at = now();
