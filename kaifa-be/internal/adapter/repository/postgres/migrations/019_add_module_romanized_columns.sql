ALTER TABLE modules
	ADD COLUMN IF NOT EXISTS title_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS description_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS topic_scope_romanized text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS activities_romanized text[] NOT NULL DEFAULT '{}'::text[],
	ADD COLUMN IF NOT EXISTS grammar_focus_romanized text[] NOT NULL DEFAULT '{}'::text[];

UPDATE modules
SET
	title_romanized = CASE id
		WHEN 'mod-arab-vii-01' THEN 'Sabah al-khayr, kayfa haluk?'
		WHEN 'mod-arab-vii-02' THEN 'Hatha ana'
		WHEN 'mod-arab-vii-03' THEN 'Kam al-sa''aa?'
		WHEN 'mod-arab-vii-04' THEN 'Hatha ''alami'
		WHEN 'mod-arab-vii-05' THEN 'Innahu yawm jamil'
		WHEN 'mod-arab-vii-06' THEN 'Nahnu nuhibbu ma naf''alu'
		WHEN 'mod-arab-vii-07' THEN 'Ana fakhuur bi-Indunisiya'
		WHEN 'mod-arab-vii-08' THEN 'Hatha ma yanbaghi ''ala al-ashdiqa'' fi''luhu'
		ELSE title_romanized
	END,
	description_romanized = CASE id
		WHEN 'mod-arab-vii-01' THEN 'Tadarrab ''ala al-tahiyya bi-''ibarat muhadhaaba'
		WHEN 'mod-arab-vii-02' THEN 'A''rif binafsik wa bi-''a''ilatik wa ma''lumatik al-shakhsiya'
		WHEN 'mod-arab-vii-03' THEN 'Tadarrab ''ala qawl al-waqt'
		WHEN 'mod-arab-vii-04' THEN 'Yasif al-tullab bi''at al-madrasa wa al-fasl al-dirasi wa al-maktaba wa al-maqsaf bi-istikhdam al-mudari'' al-basit wa al-lugha al-wasfiya.'
		WHEN 'mod-arab-vii-05' THEN 'Yatahaddath al-tullab ''an tajaribihim al-yawmiyya fi al-madrasa wa al-maktaba wa al-maqsaf ma''a al-ta''bir ''an al-mashaa''ir wa al-ara'' wa al-rutin.'
		WHEN 'mod-arab-vii-06' THEN 'Yashrah al-tullab al-anshita allati yastamti''una biha fi al-madrasa wa al-maktaba wa al-maqsaf, wa yasifun sabab ahmiyyat hadhihi al-anshita.'
		WHEN 'mod-arab-vii-07' THEN 'Yasif al-tullab Indunisiya wa sha''baha wa thaqafatiha wa injazatiha ma''a al-ta''bir ''an al-fakhr bi-watanihim.'
		WHEN 'mod-arab-vii-08' THEN 'Yunaqish al-tullab al-sadaqa wa al-''amal al-jama''i wa al-ruh al-riyadiya fi bi''at al-madrasa wa al-riyada.'
		ELSE description_romanized
	END,
	topic_scope_romanized = CASE id
		WHEN 'mod-arab-vii-01' THEN 'al-tahiyyat, al-radd ''ala al-tahiyya, al-''ibarat al-muhadhdaba, al-ma''lumat al-shakhsiya, al-dama''ir'
		WHEN 'mod-arab-vii-02' THEN 'al-fasl al-dirasi, al-huwiya al-shakhsiya, afrad al-''a''ila, al-ma''lumat al-shakhsiya'
		WHEN 'mod-arab-vii-03' THEN 'al-fasl al-dirasi, qawl al-waqt, al-su''al ''an al-waqt, ta''birat al-waqt, al-anshita al-yawmiyya, al-arqam'
		WHEN 'mod-arab-vii-04' THEN 'al-madrasa, al-fasl al-dirasi, al-maktaba, al-maqsaf, al-mu''allim, al-talib, al-kitab, al-ta''am, al-maraafiq, al-hayat al-madrasiyya al-yawmiyya'
		WHEN 'mod-arab-vii-05' THEN 'bi''at al-madrasa, anshita al-maktaba, anshita al-maqsaf, al-rutin al-yawmi, al-mashaa''ir, al-taqs, yawm jamil, al-ashdiqa'', al-qira''a, al-dirasa'
		WHEN 'mod-arab-vii-06' THEN 'al-anshita al-madrasiyya, al-maktaba, al-maqsaf, al-hawaayat, al-ihtimamat, al-ta''allum, al-qira''a, al-anshita al-jama''iyya, al-mawad al-mufaddala, al-tafdilat al-shakhsiya'
		WHEN 'mod-arab-vii-07' THEN 'Indunisiya, al-huwiya al-wataniyya, al-thaqafa, al-lugha, al-madrasa, al-mujtama'', al-riyada, al-injaz, al-''ilm, al-fakhr al-watani'
		WHEN 'mod-arab-vii-08' THEN 'al-sadaqa, musa''adat al-akharin, al-''amal al-jama''i, al-madrasa, kurat al-qadam, al-risha al-ta''ira, kurat al-salla, al-ruh al-riyadiya, al-ihtiram, al-la''ib al-nazih'
		ELSE topic_scope_romanized
	END,
	activities_romanized = CASE id
		WHEN 'mod-arab-vii-01' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-02' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-03' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-04' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-05' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-06' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-07' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		WHEN 'mod-arab-vii-08' THEN ARRAY['al-istima''', 'al-tahadduth', 'tarh al-as''ila']
		ELSE activities_romanized
	END,
	grammar_focus_romanized = CASE id
		WHEN 'mod-arab-vii-01' THEN ARRAY['tajrubat al-tahiyya', 'dama''ir al-fa''il', 'zaman al-mudari'' al-basit', 'al-as''ila al-basita']
		WHEN 'mod-arab-vii-02' THEN ARRAY['taqdim al-nafs', 'sifat al-milkiyya', 'al-mudari'' al-basit', 'as''ilat al-istifham']
		WHEN 'mod-arab-vii-03' THEN ARRAY['qawl al-waqt', 'zaman al-mudari'' al-basit', 'al-rutin al-yawmi', 'huruf al-jar lil-waqt']
		WHEN 'mod-arab-vii-04' THEN ARRAY['zaman al-mudari'' al-basit', 'hunaka lil-mufrad wa hunaka lil-jam''', 'asma'' al-ishara', 'wasf al-amkina']
		WHEN 'mod-arab-vii-05' THEN ARRAY['zaman al-mudari'' al-basit', 'al-sifat', 'al-ta''bir ''an al-mashaa''ir', 'zuruuf al-takrar']
		WHEN 'mod-arab-vii-06' THEN ARRAY['zaman al-mudari'' al-basit', 'al-ta''bir ''an al-i''jab wa al-tafdilat', 'jumal al-sabab bi-istikhdam li''an', 'dama''ir al-fa''il wa al-maf''ul']
		WHEN 'mod-arab-vii-07' THEN ARRAY['zaman al-mudari'' al-basit', 'al-sifat', 'al-ta''bir ''an al-fakhr', 'i''ata'' asbab basita']
		WHEN 'mod-arab-vii-08' THEN ARRAY['al-fi''l al-naqis yanbaghi', 'zaman al-mudari'' al-basit', 'taqdim al-nasiha', 'al-ta''bir ''an al-mas''uliyya']
		ELSE grammar_focus_romanized
	END
WHERE language = 'arabic';
