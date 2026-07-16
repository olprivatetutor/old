CREATE TABLE IF NOT EXISTS users (
	id text PRIMARY KEY,
	email text NOT NULL UNIQUE,
	full_name text NOT NULL,
	dob date NOT NULL,
	gender text NOT NULL DEFAULT '',
	role text NOT NULL DEFAULT 'student',
	class text NOT NULL DEFAULT '',
	current_proficiency_level text NOT NULL,
	password_hash text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS syllabi (
	id text PRIMARY KEY,
	language text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	title_romanized text NOT NULL DEFAULT '',
	description_romanized text NOT NULL DEFAULT '',
	class text NOT NULL,
	level text[] NOT NULL,
	icon text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS syllabi_translation (
	id text PRIMARY KEY,
	syllabi_id text NOT NULL REFERENCES syllabi(id) ON DELETE CASCADE,
	language text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	UNIQUE (syllabi_id, language)
);

CREATE TABLE IF NOT EXISTS modules (
	id text PRIMARY KEY,
	syllabus_id text NOT NULL REFERENCES syllabi(id) ON DELETE CASCADE,
	language text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	title_romanized text NOT NULL DEFAULT '',
	description_romanized text NOT NULL DEFAULT '',
	topic_scope text NOT NULL,
	topic_scope_romanized text NOT NULL DEFAULT '',
	activities text[] NOT NULL DEFAULT '{}'::text[],
	activities_romanized text[] NOT NULL DEFAULT '{}'::text[],
	vocabulary_load integer NOT NULL DEFAULT 0,
	grammar_focus text[] NOT NULL DEFAULT '{}'::text[],
	grammar_focus_romanized text[] NOT NULL DEFAULT '{}'::text[],
	topic_scope_terms text[] NOT NULL DEFAULT '{}'::text[],
	estimation_duration_minutes integer NOT NULL DEFAULT 0,
	mastery_threshold integer NOT NULL DEFAULT 0,
	status text NOT NULL,
	module_order integer NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	UNIQUE (syllabus_id, module_order)
);

CREATE TABLE IF NOT EXISTS modules_translation (
	id text PRIMARY KEY,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	language text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	topic_scope text NOT NULL,
	activities text[] NOT NULL DEFAULT '{}'::text[],
	grammar_focus text[] NOT NULL DEFAULT '{}'::text[],
	topic_scope_terms text[] NOT NULL DEFAULT '{}'::text[],
	UNIQUE (module_id, language)
);

CREATE TABLE IF NOT EXISTS assessment_sessions (
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	language text NOT NULL,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	topic_scope text NOT NULL,
	messages jsonb NOT NULL DEFAULT '[]'::jsonb,
	result jsonb NOT NULL DEFAULT 'null'::jsonb,
	completed boolean NOT NULL DEFAULT false,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY (user_id, language)
);

CREATE TABLE IF NOT EXISTS learning_sessions (
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	language text NOT NULL,
	module_id text NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
	level text NOT NULL,
	topic_scope text NOT NULL,
	current_step integer NOT NULL DEFAULT 1,
	learning_path jsonb NOT NULL DEFAULT 'null'::jsonb,
	listening_state jsonb NOT NULL DEFAULT 'null'::jsonb,
	messages jsonb NOT NULL DEFAULT '[]'::jsonb,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	PRIMARY KEY (user_id, language)
);

INSERT INTO users (id, email, full_name, dob, gender, role, class, current_proficiency_level, password_hash)
VALUES
	('stdnt0001', 'umar@kaifa.com', 'umar', '2018-12-31', 'male', 'student', 'VII', 'A2', '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC'),
	('stdnt0002', 'sasuke@konoha.com', 'Uchiha Sasuke', '2018-04-01', 'male', 'student', 'XII', 'B1', '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC'),
	('stdnt0003', 'nobita@konoha.com', 'Nobita Nobi', '2018-09-28', '', 'student', 'IX', 'A1', '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC'),
	('stdnt0004', 'aisha@kaifa.com', 'aisha', '2018-03-28', 'female', 'student', 'VII', 'A1', '$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC')
ON CONFLICT (id) DO UPDATE SET
	email = EXCLUDED.email,
	full_name = EXCLUDED.full_name,
	dob = EXCLUDED.dob,
	gender = EXCLUDED.gender,
	role = EXCLUDED.role,
	class = EXCLUDED.class,
	current_proficiency_level = EXCLUDED.current_proficiency_level,
	password_hash = EXCLUDED.password_hash,
	updated_at = now();
