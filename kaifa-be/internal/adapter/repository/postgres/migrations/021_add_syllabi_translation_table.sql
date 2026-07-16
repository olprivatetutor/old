CREATE TABLE IF NOT EXISTS syllabi_translation (
	id text PRIMARY KEY,
	syllabi_id text NOT NULL REFERENCES syllabi(id) ON DELETE CASCADE,
	language text NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	UNIQUE (syllabi_id, language)
);

INSERT INTO syllabi_translation (id, syllabi_id, language, title, description)
VALUES
	('syl-eng-vii-01-bi', 'syl-eng-vii-01', 'bahasa indonesia', 'Komunikasi sehari-hari', 'Belajar memperkenalkan diri dan menggunakan bahasa Inggris dalam percakapan sehari-hari.'),
	('syl-eng-vii-02-bi', 'syl-eng-vii-02', 'bahasa indonesia', 'Duniaku, hariku, dan kegiatanku', 'Siswa berbicara tentang pengalaman sehari-hari mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas.'),
	('syl-eng-vii-03-bi', 'syl-eng-vii-03', 'bahasa indonesia', 'Bersatu dalam kebanggaan, terikat oleh persahabatan', 'Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada negara mereka.'),
	('syl-arab-vii-01-bi', 'syl-arab-vii-01', 'bahasa indonesia', 'Assalamu''alaikum', 'Salam dan perkenalan.'),
	('syl-arab-vii-02-bi', 'syl-arab-vii-02', 'bahasa indonesia', 'Duniaku, hariku, dan kegiatanku', 'Siswa berbicara tentang pengalaman sehari-hari mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas harian.'),
	('syl-arab-vii-03-bi', 'syl-arab-vii-03', 'bahasa indonesia', 'Bersatu dalam kebanggaan dan terikat oleh persahabatan', 'Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada tanah air mereka.')
ON CONFLICT (syllabi_id, language) DO UPDATE SET
	title = EXCLUDED.title,
	description = EXCLUDED.description;
