INSERT INTO syllabi (id, language, title, description, class, level, icon)
VALUES
	('syl-eng-vii-01', 'english', 'Daily life communication', 'Learn how to introduce yourself and use english in daily conversation', 'VII', ARRAY['A1','A2','B1'], '📘'),
	('syl-eng-vii-02', 'english', 'My world, my day and my activity', 'Students talk about their daily experiences at school, the library, and the canteen while expressing feelings, opinions, and routines.', 'VII', ARRAY['A1','A2','B1'], '📘'),
	('syl-eng-vii-03', 'english', 'United in pride, bound by friendship', 'Students describe Indonesia, its people, culture, and achievements while expressing pride in their country.', 'VII', ARRAY['A1','A2','B1'], '📘')
ON CONFLICT (id) DO UPDATE SET
	language = EXCLUDED.language,
	title = EXCLUDED.title,
	description = EXCLUDED.description,
	class = EXCLUDED.class,
	level = EXCLUDED.level,
	icon = EXCLUDED.icon,
	updated_at = now();

INSERT INTO modules (
	id, syllabus_id, language, title, description, topic_scope, status, module_order,
	activities, vocabulary_load, grammar_focus, topic_scope_terms,
	estimation_duration_minutes, mastery_threshold
)
VALUES
	('mod-eng-vii-01', 'syl-eng-vii-01', 'english', 'Good morning, how are you', 'Practice greeting with polite expression', 'classroom, family, friend, class, greeting, response, polite expression, farewell', 'available', 1, ARRAY['listening','speaking','ask questions'], 40, ARRAY['greeting experience','subject pronouns','simple present tense','simple question'], ARRAY['classroom','family','friend','class','greeting','response','polite expression','farewell'], 30, 80),
	('mod-eng-vii-02', 'syl-eng-vii-01', 'english', 'This is me', 'Introduce yourself, family and personal information', 'classroom, personal identity, family members, personal information', 'available', 2, ARRAY['listening','speaking','ask questions'], 60, ARRAY['introducing yourself','possesive adjective','simple present','wh question'], ARRAY['classroom','personal identity','family members','personal information'], 30, 80),
	('mod-eng-vii-03', 'syl-eng-vii-01', 'english', 'What time is it', 'Practice telling time', 'classroom, telling time, asking time, time expression, daily activities', 'available', 3, ARRAY['listening','speaking','ask questions'], 100, ARRAY['telling time','simple present tense','daily routing','preposition of time'], ARRAY['classroom','telling time','asking time','time expression','daily activities'], 30, 80),
	('mod-eng-vii-04', 'syl-eng-vii-02', 'english', 'This Is My World', 'Students describe their school environment, classroom, library, and canteen using simple present tense and descriptive language.', 'school, classroom, library, canteen, teacher, student, book, food, facilities, daily school life', 'available', 4, ARRAY['listening','speaking','ask questions'], 60, ARRAY['simple present tense','there is and there are','demonstrative pronouns','describing places'], ARRAY['school','classroom','library','canteen','teacher','student','book','food','facilities','daily school life'], 30, 80),
	('mod-eng-vii-05', 'syl-eng-vii-02', 'english', 'It''s a Beautiful Day', 'Students talk about their daily experiences at school, the library, and the canteen while expressing feelings, opinions, and routines.', 'school environment, library activities, canteen activities, daily routine, feelings, weather, beautiful day, friends, reading, studying', 'available', 5, ARRAY['listening','speaking','ask questions'], 80, ARRAY['simple present tense','adjectives','expressing feelings','frequency adverbs'], ARRAY['school environment','library activities','canteen activities','daily routine','feelings','weather','beautiful day','friends','reading','studying'], 30, 80),
	('mod-eng-vii-06', 'syl-eng-vii-02', 'english', 'We Love What We Do', 'Students explain activities they enjoy at school, in the library, and in the canteen, and describe why these activities are meaningful.', 'school activities, library, canteen, hobbies, interests, learning, reading, group activities, favorite subjects, personal preferences', 'available', 6, ARRAY['listening','speaking','ask questions'], 100, ARRAY['simple present tense','expressing likes and preferences','because clauses','subject and object pronouns'], ARRAY['school activities','library','canteen','hobbies','interests','learning','reading','group activities','favorite subjects','personal preferences'], 30, 80),
	('mod-eng-vii-07', 'syl-eng-vii-03', 'english', 'I''m Proud of Indonesia', 'Students describe Indonesia, its people, culture, and achievements while expressing pride in their country.', 'Indonesia, national identity, culture, language, school, community, sports, achievement, flag, national pride', 'available', 7, ARRAY['listening','speaking','ask questions'], 80, ARRAY['simple present tense','adjectives','expressing pride','giving simple reasons'], ARRAY['Indonesia','national identity','culture','language','school','community','sports','achievement','flag','national pride'], 30, 80),
	('mod-eng-vii-08', 'syl-eng-vii-03', 'english', 'That''s What Friends Are Supposed To Do', 'Students discuss friendship, teamwork, and sportsmanship in school and sports environments.', 'friendship, helping others, teamwork, school, soccer, badminton, basketball, sportsmanship, respect, fair play', 'available', 8, ARRAY['listening','speaking','ask questions'], 100, ARRAY['modal should','simple present tense','giving advice','expressing responsibility'], ARRAY['friendship','helping others','teamwork','school','soccer','badminton','basketball','sportsmanship','respect','fair play'], 30, 80)
ON CONFLICT (id) DO UPDATE SET
	syllabus_id = EXCLUDED.syllabus_id,
	language = EXCLUDED.language,
	title = EXCLUDED.title,
	description = EXCLUDED.description,
	topic_scope = EXCLUDED.topic_scope,
	status = EXCLUDED.status,
	module_order = EXCLUDED.module_order,
	activities = EXCLUDED.activities,
	vocabulary_load = EXCLUDED.vocabulary_load,
	grammar_focus = EXCLUDED.grammar_focus,
	topic_scope_terms = EXCLUDED.topic_scope_terms,
	estimation_duration_minutes = EXCLUDED.estimation_duration_minutes,
	mastery_threshold = EXCLUDED.mastery_threshold,
	updated_at = now();
