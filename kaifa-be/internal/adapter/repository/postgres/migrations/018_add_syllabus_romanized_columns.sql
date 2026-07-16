ALTER TABLE syllabi
	ADD COLUMN IF NOT EXISTS title_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS description_romanized text NOT NULL DEFAULT '';

UPDATE syllabi
SET
	title_romanized = CASE id
		WHEN 'syl-arab-vii-01' THEN 'As-salamu alaykum'
		WHEN 'syl-arab-vii-02' THEN 'Alami wa yawmi wa anshitati'
		WHEN 'syl-arab-vii-03' THEN 'Mutahidun bil-fakhr wa murtabitun bis-sadaqa'
		ELSE title_romanized
	END,
	description_romanized = CASE id
		WHEN 'syl-arab-vii-01' THEN 'At-tahiyyat wa at-taaruf'
		WHEN 'syl-arab-vii-02' THEN 'Yatahaddath al-tullab ''an tajaribihim al-yawmiyyah fi al-madrasa wa al-maktaba wa al-maqsaf ma''a al-ta''bir ''an al-mashaa''ir wa al-ara'' wa al-rutin al-yawmi.'
		WHEN 'syl-arab-vii-03' THEN 'Yasif al-tullab Indunisiya wa sha''baha wa thaqafatiha wa injazatiha ma''a al-ta''bir ''an al-fakhr bi-watanihim.'
		ELSE description_romanized
	END
WHERE language = 'arabic';
