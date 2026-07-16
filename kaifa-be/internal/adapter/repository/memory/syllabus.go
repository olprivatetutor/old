package memory

import (
	"context"
	"fmt"
	"strings"
	"sync"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

type SyllabusRepository struct {
	mu      sync.RWMutex
	syllabi []entity.Syllabus
}

var defaultSyllabusRepository = NewSyllabusRepository()

func NewSyllabusRepository() *SyllabusRepository {
	return &SyllabusRepository{syllabi: seedSyllabi()}
}

func seedSyllabi() []entity.Syllabus {
	return append(classVIISyllabi(), classVIIArabicSyllabi()...)
}

func classVIISyllabi() []entity.Syllabus {
	return []entity.Syllabus{
		{
			ID:          "syl-eng-vii-01",
			Language:    "english",
			Title:       "Daily life communication",
			Description: "Learn how to introduce yourself and use english in daily conversation",
			Class:       "VII",
			Level:       []string{"A1", "A2", "B1"},
			Icon:        "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-eng-vii-01-bi", "syl-eng-vii-01", "bahasa indonesia", "Komunikasi sehari-hari", "Belajar memperkenalkan diri dan menggunakan bahasa Inggris dalam percakapan sehari-hari."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-01", "syl-eng-vii-01", "Good morning, how are you", "Practice greeting with polite expression", []string{"classroom", "family", "friend", "class", "greeting", "response", "polite expression", "farewell"}, 1, 40, []string{"greeting experience", "subject pronouns", "simple present tense", "simple question"}),
					newModuleTranslation("mod-eng-vii-01-bi", "mod-eng-vii-01", "bahasa indonesia", "Komunikasi kehidupan sehari-hari", "Belajar memperkenalkan diri dan menggunakan bahasa Inggris dalam percakapan harian", "ruang kelas, keluarga, teman, kelas, sapaan, respons, ungkapan sopan, perpisahan", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"pengalaman menyapa", "kata ganti subjek", "simple present tense", "pertanyaan sederhana"}, []string{"ruang kelas", "keluarga", "teman", "kelas", "sapaan", "respons", "ungkapan sopan", "perpisahan"}),
				),
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-02", "syl-eng-vii-01", "This is me", "Introduce yourself, family and personal information", []string{"classroom", "personal identity", "family members", "personal information"}, 2, 60, []string{"introducing yourself", "possesive adjective", "simple present", "wh question"}),
					newModuleTranslation("mod-eng-vii-02-bi", "mod-eng-vii-02", "bahasa indonesia", "Ini tentang saya", "Perkenalkan diri, keluarga, dan informasi pribadi", "ruang kelas, identitas pribadi, anggota keluarga, informasi pribadi", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"mengenalkan diri", "kata sifat kepemilikan", "simple present", "kata tanya"}, []string{"ruang kelas", "identitas pribadi", "anggota keluarga", "informasi pribadi"}),
				),
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-03", "syl-eng-vii-01", "What time is it", "Practice telling time", []string{"classroom", "telling time", "asking time", "time expression", "daily activities"}, 3, 100, []string{"telling time", "simple present tense", "daily routing", "preposition of time"}),
					newModuleTranslation("mod-eng-vii-03-bi", "mod-eng-vii-03", "bahasa indonesia", "Jam berapa sekarang?", "Berlatih menyebutkan waktu", "ruang kelas, menyebut waktu, menanyakan waktu, ungkapan waktu, kegiatan harian", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"menyebut waktu", "simple present tense", "rutinitas harian", "preposisi waktu"}, []string{"ruang kelas", "menyebut waktu", "menanyakan waktu", "ungkapan waktu", "kegiatan harian"}),
				),
			},
		},
		{
			ID:          "syl-eng-vii-02",
			Language:    "english",
			Title:       "My world, my day and my activity",
			Description: "Students talk about their daily experiences at school, the library, and the canteen while expressing feelings, opinions, and routines.",
			Class:       "VII",
			Level:       []string{"A1", "A2", "B1"},
			Icon:        "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-eng-vii-02-bi", "syl-eng-vii-02", "bahasa indonesia", "Duniaku, hariku, dan kegiatanku", "Siswa berbicara tentang pengalaman sehari-hari mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-04", "syl-eng-vii-02", "This Is My World", "Students describe their school environment, classroom, library, and canteen using simple present tense and descriptive language.", []string{"school", "classroom", "library", "canteen", "teacher", "student", "book", "food", "facilities", "daily school life"}, 4, 60, []string{"simple present tense", "there is and there are", "demonstrative pronouns", "describing places"}),
					newModuleTranslation("mod-eng-vii-04-bi", "mod-eng-vii-04", "bahasa indonesia", "Inilah duniaku", "Siswa mendeskripsikan lingkungan sekolah, kelas, perpustakaan, dan kantin menggunakan simple present tense dan bahasa deskriptif.", "sekolah, kelas, perpustakaan, kantin, guru, siswa, buku, makanan, fasilitas, kehidupan sekolah sehari-hari", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "there is dan there are", "kata ganti penunjuk", "mendeskripsikan tempat"}, []string{"sekolah", "kelas", "perpustakaan", "kantin", "guru", "siswa", "buku", "makanan", "fasilitas", "kehidupan sekolah sehari-hari"}),
				),
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-05", "syl-eng-vii-02", "It's a Beautiful Day", "Students talk about their daily experiences at school, the library, and the canteen while expressing feelings, opinions, and routines.", []string{"school environment", "library activities", "canteen activities", "daily routine", "feelings", "weather", "beautiful day", "friends", "reading", "studying"}, 5, 80, []string{"simple present tense", "adjectives", "expressing feelings", "frequency adverbs"}),
					newModuleTranslation("mod-eng-vii-05-bi", "mod-eng-vii-05", "bahasa indonesia", "Ini hari yang indah", "Siswa berbicara tentang pengalaman harian mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas.", "lingkungan sekolah, kegiatan perpustakaan, kegiatan kantin, rutinitas harian, perasaan, cuaca, hari yang indah, teman, membaca, belajar", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "adjektiva", "mengungkapkan perasaan", "adverbia frekuensi"}, []string{"lingkungan sekolah", "kegiatan perpustakaan", "kegiatan kantin", "rutinitas harian", "perasaan", "cuaca", "hari yang indah", "teman", "membaca", "belajar"}),
				),
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-06", "syl-eng-vii-02", "We Love What We Do", "Students explain activities they enjoy at school, in the library, and in the canteen, and describe why these activities are meaningful.", []string{"school activities", "library", "canteen", "hobbies", "interests", "learning", "reading", "group activities", "favorite subjects", "personal preferences"}, 6, 100, []string{"simple present tense", "expressing likes and preferences", "because clauses", "subject and object pronouns"}),
					newModuleTranslation("mod-eng-vii-06-bi", "mod-eng-vii-06", "bahasa indonesia", "Kami menyukai apa yang kami lakukan", "Siswa menjelaskan kegiatan yang mereka sukai di sekolah, perpustakaan, dan kantin, serta menjelaskan alasan kegiatan itu bermakna.", "kegiatan sekolah, perpustakaan, kantin, hobi, minat, belajar, membaca, kegiatan kelompok, mata pelajaran favorit, preferensi pribadi", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "menyatakan suka dan preferensi", "klausa sebab", "kata ganti subjek dan objek"}, []string{"kegiatan sekolah", "perpustakaan", "kantin", "hobi", "minat", "belajar", "membaca", "kegiatan kelompok", "mata pelajaran favorit", "preferensi pribadi"}),
				),
			},
		},
		{
			ID:          "syl-eng-vii-03",
			Language:    "english",
			Title:       "United in pride, bound by friendship",
			Description: "Students describe Indonesia, its people, culture, and achievements while expressing pride in their country.",
			Class:       "VII",
			Level:       []string{"A1", "A2", "B1"},
			Icon:        "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-eng-vii-03-bi", "syl-eng-vii-03", "bahasa indonesia", "Bersatu dalam kebanggaan, terikat oleh persahabatan", "Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada negara mereka."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-07", "syl-eng-vii-03", "I'm Proud of Indonesia", "Students describe Indonesia, its people, culture, and achievements while expressing pride in their country.", []string{"Indonesia", "national identity", "culture", "language", "school", "community", "sports", "achievement", "flag", "national pride"}, 7, 80, []string{"simple present tense", "adjectives", "expressing pride", "giving simple reasons"}),
					newModuleTranslation("mod-eng-vii-07-bi", "mod-eng-vii-07", "bahasa indonesia", "Saya bangga pada Indonesia", "Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada negara mereka.", "Indonesia, identitas nasional, budaya, bahasa, sekolah, masyarakat, olahraga, prestasi, bendera, kebanggaan nasional", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "adjektiva", "mengungkapkan kebanggaan", "memberi alasan sederhana"}, []string{"Indonesia", "identitas nasional", "budaya", "bahasa", "sekolah", "masyarakat", "olahraga", "prestasi", "bendera", "kebanggaan nasional"}),
				),
				moduleWithTranslation(
					newClassVIIModule("mod-eng-vii-08", "syl-eng-vii-03", "That's What Friends Are Supposed To Do", "Students discuss friendship, teamwork, and sportsmanship in school and sports environments.", []string{"friendship", "helping others", "teamwork", "school", "soccer", "badminton", "basketball", "sportsmanship", "respect", "fair play"}, 8, 100, []string{"modal should", "simple present tense", "giving advice", "expressing responsibility"}),
					newModuleTranslation("mod-eng-vii-08-bi", "mod-eng-vii-08", "bahasa indonesia", "Itulah yang seharusnya dilakukan teman", "Siswa membahas persahabatan, kerja sama tim, dan sportivitas di lingkungan sekolah dan olahraga.", "persahabatan, membantu orang lain, kerja sama tim, sekolah, sepak bola, bulu tangkis, bola basket, sportivitas, hormat, permainan yang adil", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"should", "simple present tense", "memberi nasihat", "menunjukkan tanggung jawab"}, []string{"persahabatan", "membantu orang lain", "kerja sama tim", "sekolah", "sepak bola", "bulu tangkis", "bola basket", "sportivitas", "hormat", "permainan yang adil"}),
				),
			},
		},
	}
}

func newClassVIIModule(id string, syllabusID string, title string, description string, topicScopeTerms []string, order int, vocabularyLoad int, grammarFocus []string) entity.Module {
	return entity.Module{
		ID:                        id,
		SyllabusID:                syllabusID,
		Language:                  "english",
		Title:                     title,
		Description:               description,
		TopicScope:                strings.Join(topicScopeTerms, ", "),
		Activities:                []string{"listening", "speaking", "ask questions"},
		VocabularyLoad:            vocabularyLoad,
		GrammarFocus:              grammarFocus,
		TopicScopeTerms:           append([]string(nil), topicScopeTerms...),
		EstimationDurationMinutes: 30,
		MasteryThreshold:          80,
		Status:                    "available",
		Order:                     order,
	}
}

func moduleWithTranslation(module entity.Module, translations ...entity.ModuleTranslation) entity.Module {
	module.Translations = append([]entity.ModuleTranslation(nil), translations...)
	return module
}

func newModuleTranslation(id string, moduleID string, language string, title string, description string, topicScope string, activities []string, grammarFocus []string, topicScopeTerms []string) entity.ModuleTranslation {
	return entity.ModuleTranslation{
		ID:              id,
		ModuleID:        moduleID,
		Language:        language,
		Title:           title,
		Description:     description,
		TopicScope:      topicScope,
		Activities:      append([]string(nil), activities...),
		GrammarFocus:    append([]string(nil), grammarFocus...),
		TopicScopeTerms: append([]string(nil), topicScopeTerms...),
	}
}

func classVIIArabicSyllabi() []entity.Syllabus {
	return []entity.Syllabus{
		{
			ID:                   "syl-arab-vii-01",
			Language:             "arabic",
			Title:                "السلام عليكم",
			Description:          "التحيات والتعارف",
			TitleRomanized:       "As-salamu alaykum",
			DescriptionRomanized: "At-tahiyyat wa at-taaruf",
			Class:                "VII",
			Level:                []string{"A1", "A2", "B1"},
			Icon:                 "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-arab-vii-01-bi", "syl-arab-vii-01", "bahasa indonesia", "Assalamu'alaikum", "Salam dan perkenalan."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-01",
						SyllabusID:                "syl-arab-vii-01",
						Language:                  "arabic",
						Title:                     "صباح الخير، كيف حالك؟",
						Description:               "تدرّب على التحية بعبارات مهذبة",
						TitleRomanized:            "Sabah al-khayr, kayfa haluk?",
						DescriptionRomanized:      "Tadarrab 'ala al-tahiyya bi-'ibarat muhadhaaba",
						TopicScope:                "التحيات, الرد على التحية, العبارات المهذبة, المعلومات الشخصية, الضمائر",
						TopicScopeRomanized:       "at-tahiyyat, al-radd 'ala al-tahiyya, al-'ibarat al-muhadhdaba, al-ma'lumat al-shakhsiya, al-dama'ir",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            40,
						GrammarFocus:              []string{"تجارب التحية", "ضمائر الفاعل", "زمن المضارع البسيط", "الأسئلة البسيطة"},
						GrammarFocusRomanized:     []string{"tajrubat al-tahiyya", "dama'ir al-fa'il", "zaman al-mudari' al-basit", "al-as'ila al-basita"},
						TopicScopeTerms:           []string{"التحيات", "الرد على التحية", "العبارات المهذبة", "المعلومات الشخصية", "الضمائر"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     1,
					},
					newModuleTranslation("mod-arab-vii-01-bi", "mod-arab-vii-01", "bahasa indonesia", "Selamat pagi, apa kabar?", "Berlatih memberi salam dengan ungkapan sopan", "salam, respons salam, ungkapan sopan, informasi pribadi, kata ganti", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"pengalaman menyapa", "kata ganti subjek", "simple present tense", "pertanyaan sederhana"}, []string{"salam", "respons salam", "ungkapan sopan", "informasi pribadi", "kata ganti"}),
				),
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-02",
						SyllabusID:                "syl-arab-vii-01",
						Language:                  "arabic",
						Title:                     "هذا أنا",
						Description:               "عرّف بنفسك وبعائلتك ومعلوماتك الشخصية",
						TitleRomanized:            "Hatha ana",
						DescriptionRomanized:      "A'rif binafsik wa bi-'a'ilatik wa ma'lumatik al-shakhsiya",
						TopicScope:                "الفصل الدراسي, الهوية الشخصية, أفراد العائلة, المعلومات الشخصية",
						TopicScopeRomanized:       "al-fasl al-dirasi, al-huwiya al-shakhsiya, afrad al-'a'ila, al-ma'lumat al-shakhsiya",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            60,
						GrammarFocus:              []string{"تقديم النفس", "صفات الملكية", "المضارع البسيط", "أسئلة الاستفهام"},
						GrammarFocusRomanized:     []string{"taqdim al-nafs", "sifat al-milkiyya", "al-mudari' al-basit", "as'ilat al-istifham"},
						TopicScopeTerms:           []string{"الفصل الدراسي", "الهوية الشخصية", "أفراد العائلة", "المعلومات الشخصية"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     2,
					},
					newModuleTranslation("mod-arab-vii-02-bi", "mod-arab-vii-02", "bahasa indonesia", "Ini aku", "Perkenalkan diri, keluarga, dan informasi pribadi", "ruang kelas, identitas pribadi, anggota keluarga, informasi pribadi", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"mengenalkan diri", "kata sifat kepemilikan", "simple present", "kata tanya"}, []string{"ruang kelas", "identitas pribadi", "anggota keluarga", "informasi pribadi"}),
				),
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-03",
						SyllabusID:                "syl-arab-vii-01",
						Language:                  "arabic",
						Title:                     "كم الساعة؟",
						Description:               "تدرب على قول الوقت",
						TitleRomanized:            "Kam al-sa'aa?",
						DescriptionRomanized:      "Tadarrab 'ala qawl al-waqt",
						TopicScope:                "الفصل الدراسي, قول الوقت, السؤال عن الوقت, تعبيرات الوقت, الأنشطة اليومية, الأرقام",
						TopicScopeRomanized:       "al-fasl al-dirasi, qawl al-waqt, al-su'al 'an al-waqt, ta'birat al-waqt, al-anshita al-yawmiyya, al-arqam",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            100,
						GrammarFocus:              []string{"قول الوقت", "زمن المضارع البسيط", "الروتين اليومي", "حروف الجر للوقت"},
						GrammarFocusRomanized:     []string{"qawl al-waqt", "zaman al-mudari' al-basit", "al-rutin al-yawmi", "huruf al-jar lil-waqt"},
						TopicScopeTerms:           []string{"الفصل الدراسي", "قول الوقت", "السؤال عن الوقت", "تعبيرات الوقت", "الأنشطة اليومية", "الأرقام"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     3,
					},
					newModuleTranslation("mod-arab-vii-03-bi", "mod-arab-vii-03", "bahasa indonesia", "Jam berapa sekarang?", "Berlatih menyebutkan waktu", "ruang kelas, menyebut waktu, menanyakan waktu, ungkapan waktu, kegiatan harian", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"menyebut waktu", "simple present tense", "rutinitas harian", "preposisi waktu"}, []string{"ruang kelas", "menyebut waktu", "menanyakan waktu", "ungkapan waktu", "kegiatan harian"}),
				),
			},
		},
		{
			ID:                   "syl-arab-vii-02",
			Language:             "arabic",
			Title:                "عالمي ويومي وأنشطتي",
			Description:          "يتحدث الطلاب عن تجاربهم اليومية في المدرسة والمكتبة والمقصف مع التعبير عن المشاعر والآراء والروتين اليومي.",
			TitleRomanized:       "Alami wa yawmi wa anshitati",
			DescriptionRomanized: "Yatahaddath al-tullab 'an tajaribihim al-yawmiyyah fi al-madrasa wa al-maktaba wa al-maqsaf ma'a al-ta'bir 'an al-mashaa'ir wa al-ara' wa al-rutin al-yawmi.",
			Class:                "VII",
			Level:                []string{"A1", "A2", "B1"},
			Icon:                 "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-arab-vii-02-bi", "syl-arab-vii-02", "bahasa indonesia", "Duniaku, hariku, dan kegiatanku", "Siswa berbicara tentang pengalaman sehari-hari mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas harian."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-04",
						SyllabusID:                "syl-arab-vii-02",
						Language:                  "arabic",
						Title:                     "هذا عالمي",
						Description:               "يصف الطلاب بيئة المدرسة والفصل الدراسي والمكتبة والمقصف باستخدام المضارع البسيط واللغة الوصفية.",
						TitleRomanized:            "Hatha 'alami",
						DescriptionRomanized:      "Yasif al-tullab bi'at al-madrasa wa al-fasl al-dirasi wa al-maktaba wa al-maqsaf bi-istikhdam al-mudari' al-basit wa al-lugha al-wasfiya.",
						TopicScope:                "المدرسة, الفصل الدراسي, المكتبة, المقصف, المعلم, الطالب, الكتاب, الطعام, المرافق, الحياة المدرسية اليومية",
						TopicScopeRomanized:       "al-madrasa, al-fasl al-dirasi, al-maktaba, al-maqsaf, al-mu'allim, al-talib, al-kitab, al-ta'am, al-maraafiq, al-hayat al-madrasiyya al-yawmiyya",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            60,
						GrammarFocus:              []string{"زمن المضارع البسيط", "هناك للمفرد وهناك للجمع", "أسماء الإشارة", "وصف الأماكن"},
						GrammarFocusRomanized:     []string{"zaman al-mudari' al-basit", "hunaka lil-mufrad wa hunaka lil-jam'", "asma' al-ishara", "wasf al-amkina"},
						TopicScopeTerms:           []string{"المدرسة", "الفصل الدراسي", "المكتبة", "المقصف", "المعلم", "الطالب", "الكتاب", "الطعام", "المرافق", "الحياة المدرسية اليومية"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     1,
					},
					newModuleTranslation("mod-arab-vii-04-bi", "mod-arab-vii-04", "bahasa indonesia", "Inilah duniaku", "Siswa mendeskripsikan lingkungan sekolah, kelas, perpustakaan, dan kantin menggunakan simple present tense dan bahasa deskriptif.", "sekolah, kelas, perpustakaan, kantin, guru, siswa, buku, makanan, fasilitas, kehidupan sekolah sehari-hari", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "there is dan there are", "kata ganti penunjuk", "mendeskripsikan tempat"}, []string{"sekolah", "kelas", "perpustakaan", "kantin", "guru", "siswa", "buku", "makanan", "fasilitas", "kehidupan sekolah sehari-hari"}),
				),
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-05",
						SyllabusID:                "syl-arab-vii-02",
						Language:                  "arabic",
						Title:                     "إنه يوم جميل",
						Description:               "يتحدث الطلاب عن تجاربهم اليومية في المدرسة والمكتبة والمقصف مع التعبير عن المشاعر والآراء والروتين.",
						TitleRomanized:            "Innahu yawm jamil",
						DescriptionRomanized:      "Yatahaddath al-tullab 'an tajaribihim al-yawmiyya fi al-madrasa wa al-maktaba wa al-maqsaf ma'a al-ta'bir 'an al-mashaa'ir wa al-ara' wa al-rutin.",
						TopicScope:                "بيئة المدرسة, أنشطة المكتبة, أنشطة المقصف, الروتين اليومي, المشاعر, الطقس, يوم جميل, الأصدقاء, القراءة, الدراسة",
						TopicScopeRomanized:       "bi'at al-madrasa, anshita al-maktaba, anshita al-maqsaf, al-rutin al-yawmi, al-mashaa'ir, al-taqs, yawm jamil, al-ashdiqa', al-qira'a, al-dirasa",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            80,
						GrammarFocus:              []string{"زمن المضارع البسيط", "الصفات", "التعبير عن المشاعر", "ظروف التكرار"},
						GrammarFocusRomanized:     []string{"zaman al-mudari' al-basit", "al-sifat", "al-ta'bir 'an al-mashaa'ir", "zuruuf al-takrar"},
						TopicScopeTerms:           []string{"بيئة المدرسة", "أنشطة المكتبة", "أنشطة المقصف", "الروتين اليومي", "المشاعر", "الطقس", "يوم جميل", "الأصدقاء", "القراءة", "الدراسة"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     2,
					},
					newModuleTranslation("mod-arab-vii-05-bi", "mod-arab-vii-05", "bahasa indonesia", "Ini hari yang indah", "Siswa berbicara tentang pengalaman harian mereka di sekolah, perpustakaan, dan kantin sambil mengekspresikan perasaan, pendapat, dan rutinitas.", "lingkungan sekolah, kegiatan perpustakaan, kegiatan kantin, rutinitas harian, perasaan, cuaca, hari yang indah, teman, membaca, belajar", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "adjektiva", "mengungkapkan perasaan", "adverbia frekuensi"}, []string{"lingkungan sekolah", "kegiatan perpustakaan", "kegiatan kantin", "rutinitas harian", "perasaan", "cuaca", "hari yang indah", "teman", "membaca", "belajar"}),
				),
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-06",
						SyllabusID:                "syl-arab-vii-02",
						Language:                  "arabic",
						Title:                     "نحن نحب ما نفعله",
						Description:               "يشرح الطلاب الأنشطة التي يستمتعون بها في المدرسة والمكتبة والمقصف، ويصفون سبب أهمية هذه الأنشطة.",
						TitleRomanized:            "Nahnu nuhibbu ma naf'alu",
						DescriptionRomanized:      "Yashrah al-tullab al-anshita allati yastamti'una biha fi al-madrasa wa al-maktaba wa al-maqsaf, wa yasifun sabab ahmiyyat hadhihi al-anshita.",
						TopicScope:                "الأنشطة المدرسية, المكتبة, المقصف, الهوايات, الاهتمامات, التعلّم, القراءة, الأنشطة الجماعية, المواد المفضلة, التفضيلات الشخصية",
						TopicScopeRomanized:       "al-anshita al-madrasiyya, al-maktaba, al-maqsaf, al-hawaayat, al-ihtimamat, al-ta'allum, al-qira'a, al-anshita al-jama'iyya, al-mawad al-mufaddala, al-tafdilat al-shakhsiya",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            100,
						GrammarFocus:              []string{"زمن المضارع البسيط", "التعبير عن الإعجاب والتفضيلات", "جمل السبب باستخدام لأن", "ضمائر الفاعل والمفعول"},
						GrammarFocusRomanized:     []string{"zaman al-mudari' al-basit", "al-ta'bir 'an al-i'jab wa al-tafdilat", "jumal al-sabab bi-istikhdam li'an", "dama'ir al-fa'il wa al-maf'ul"},
						TopicScopeTerms:           []string{"الأنشطة المدرسية", "المكتبة", "المقصف", "الهوايات", "الاهتمامات", "التعلّم", "القراءة", "الأنشطة الجماعية", "المواد المفضلة", "التفضيلات الشخصية"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     3,
					},
					newModuleTranslation("mod-arab-vii-06-bi", "mod-arab-vii-06", "bahasa indonesia", "Kami menyukai apa yang kami lakukan", "Siswa menjelaskan kegiatan yang mereka sukai di sekolah, perpustakaan, dan kantin, serta menjelaskan alasan kegiatan itu bermakna.", "kegiatan sekolah, perpustakaan, kantin, hobi, minat, belajar, membaca, kegiatan kelompok, mata pelajaran favorit, preferensi pribadi", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "menyatakan suka dan preferensi", "klausa sebab", "kata ganti subjek dan objek"}, []string{"kegiatan sekolah", "perpustakaan", "kantin", "hobi", "minat", "belajar", "membaca", "kegiatan kelompok", "mata pelajaran favorit", "preferensi pribadi"}),
				),
			},
		},
		{
			ID:                   "syl-arab-vii-03",
			Language:             "arabic",
			Title:                "متحدون بالفخر ومرتبطون بالصداقة",
			Description:          "يصف الطلاب إندونيسيا وشعبها وثقافتها وإنجازاتها مع التعبير عن الفخر بوطنهم.",
			TitleRomanized:       "Mutahidun bil-fakhr wa murtabitun bis-sadaqa",
			DescriptionRomanized: "Yasif al-tullab Indunisiya wa sha'baha wa thaqafatiha wa injazatiha ma'a al-ta'bir 'an al-fakhr bi-watanihim.",
			Class:                "VII",
			Level:                []string{"A1", "A2", "B1"},
			Icon:                 "📘",
			Translations: []entity.SyllabusTranslation{
				newSyllabusTranslation("syl-arab-vii-03-bi", "syl-arab-vii-03", "bahasa indonesia", "Bersatu dalam kebanggaan dan terikat oleh persahabatan", "Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada tanah air mereka."),
			},
			Modules: []entity.Module{
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-07",
						SyllabusID:                "syl-arab-vii-03",
						Language:                  "arabic",
						Title:                     "أنا فخور بإندونيسيا",
						Description:               "يصف الطلاب إندونيسيا وشعبها وثقافتها وإنجازاتها مع التعبير عن الفخر بوطنهم.",
						TitleRomanized:            "Ana fakhuur bi-Indunisiya",
						DescriptionRomanized:      "Yasif al-tullab Indunisiya wa sha'baha wa thaqafatiha wa injazatiha ma'a al-ta'bir 'an al-fakhr bi-watanihim.",
						TopicScope:                "إندونيسيا, الهوية الوطنية, الثقافة, اللغة, المدرسة, المجتمع, الرياضة, الإنجاز, العلم, الفخر الوطني",
						TopicScopeRomanized:       "Indunisiya, al-huwiya al-wataniyya, al-thaqafa, al-lugha, al-madrasa, al-mujtama', al-riyada, al-injaz, al-'ilm, al-fakhr al-watani",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            80,
						GrammarFocus:              []string{"زمن المضارع البسيط", "الصفات", "التعبير عن الفخر", "إعطاء أسباب بسيطة"},
						GrammarFocusRomanized:     []string{"zaman al-mudari' al-basit", "al-sifat", "al-ta'bir 'an al-fakhr", "i'ata' asbab basita"},
						TopicScopeTerms:           []string{"إندونيسيا", "الهوية الوطنية", "الثقافة", "اللغة", "المدرسة", "المجتمع", "الرياضة", "الإنجاز", "العلم", "الفخر الوطني"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     1,
					},
					newModuleTranslation("mod-arab-vii-07-bi", "mod-arab-vii-07", "bahasa indonesia", "Saya bangga pada Indonesia", "Siswa mendeskripsikan Indonesia, rakyatnya, budayanya, dan prestasinya sambil mengekspresikan kebanggaan pada negara mereka.", "Indonesia, identitas nasional, budaya, bahasa, sekolah, masyarakat, olahraga, prestasi, bendera, kebanggaan nasional", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"simple present tense", "adjektiva", "mengungkapkan kebanggaan", "memberi alasan sederhana"}, []string{"Indonesia", "identitas nasional", "budaya", "bahasa", "sekolah", "masyarakat", "olahraga", "prestasi", "bendera", "kebanggaan nasional"}),
				),
				moduleWithTranslation(
					entity.Module{
						ID:                        "mod-arab-vii-08",
						SyllabusID:                "syl-arab-vii-03",
						Language:                  "arabic",
						Title:                     "هذا ما ينبغي على الأصدقاء فعله",
						Description:               "يناقش الطلاب الصداقة والعمل الجماعي والروح الرياضية في بيئات المدرسة والرياضة.",
						TitleRomanized:            "Hatha ma yanbaghi 'ala al-ashdiqa' fi'luhu",
						DescriptionRomanized:      "Yunaqish al-tullab al-sadaqa wa al-'amal al-jama'i wa al-ruh al-riyadiya fi bi'at al-madrasa wa al-riyada.",
						TopicScope:                "الصداقة, مساعدة الآخرين, العمل الجماعي, المدرسة, كرة القدم, الريشة الطائرة, كرة السلة, الروح الرياضية, الاحترام, اللعب النزيه",
						TopicScopeRomanized:       "al-sadaqa, musa'adat al-akharin, al-'amal al-jama'i, al-madrasa, kurat al-qadam, al-risha al-ta'ira, kurat al-salla, al-ruh al-riyadiya, al-ihtiram, al-la'ib al-nazih",
						Activities:                []string{"الاستماع", "التحدث", "طرح الأسئلة"},
						ActivitiesRomanized:       []string{"al-istima'", "al-tahadduth", "tarh al-as'ila"},
						VocabularyLoad:            100,
						GrammarFocus:              []string{"الفعل الناقص ينبغي", "زمن المضارع البسيط", "تقديم النصيحة", "التعبير عن المسؤولية"},
						GrammarFocusRomanized:     []string{"al-fi'l al-naqis yanbaghi", "zaman al-mudari' al-basit", "taqdim al-nasiha", "al-ta'bir 'an al-mas'uliyya"},
						TopicScopeTerms:           []string{"الصداقة", "مساعدة الآخرين", "العمل الجماعي", "المدرسة", "كرة القدم", "الريشة الطائرة", "كرة السلة", "الروح الرياضية", "الاحترام", "اللعب النزيه"},
						EstimationDurationMinutes: 30,
						MasteryThreshold:          80,
						Status:                    "available",
						Order:                     2,
					},
					newModuleTranslation("mod-arab-vii-08-bi", "mod-arab-vii-08", "bahasa indonesia", "Itulah yang seharusnya dilakukan teman", "Siswa membahas persahabatan, kerja sama tim, dan sportivitas di lingkungan sekolah dan olahraga.", "persahabatan, membantu orang lain, kerja sama tim, sekolah, sepak bola, bulu tangkis, bola basket, sportivitas, hormat, permainan yang adil", []string{"mendengarkan", "berbicara", "bertanya"}, []string{"should", "simple present tense", "memberi nasihat", "menunjukkan tanggung jawab"}, []string{"persahabatan", "membantu orang lain", "kerja sama tim", "sekolah", "sepak bola", "bulu tangkis", "bola basket", "sportivitas", "hormat", "permainan yang adil"}),
				),
			},
		},
	}
}

type moduleSeed struct {
	title string
	scope string
}

func newSyllabusTranslation(id string, syllabiID string, language string, title string, description string) entity.SyllabusTranslation {
	return entity.SyllabusTranslation{
		ID:          id,
		SyllabiID:   syllabiID,
		Language:    language,
		Title:       title,
		Description: description,
	}
}

func newEnglishSyllabus(id string, title string, description string, level []string, icon string, modules []moduleSeed) entity.Syllabus {
	syllabus := entity.Syllabus{
		ID:          id,
		Language:    "english",
		Title:       title,
		Description: description,
		Class:       classFromSyllabusID(id),
		Level:       level,
		Icon:        icon,
		Modules:     make([]entity.Module, 0, len(modules)),
	}
	for i, module := range modules {
		syllabus.Modules = append(syllabus.Modules, entity.Module{
			ID:          idToModuleID(id, i+1),
			SyllabusID:  id,
			Language:    "english",
			Title:       module.title,
			Description: "Practice " + module.scope + ".",
			TopicScope:  module.scope,
			Status:      "available",
			Order:       i + 1,
		})
	}
	return syllabus
}

func classFromSyllabusID(id string) string {
	switch {
	case strings.Contains(id, "-ix-"):
		return "IX"
	case strings.Contains(id, "-xii-"):
		return "XII"
	default:
		return ""
	}
}

func idToModuleID(syllabusID string, order int) string {
	return fmt.Sprintf("%s-%02d", strings.Replace(syllabusID, "syl-", "mod-", 1), order)
}

func (r *SyllabusRepository) ListSyllabi(_ context.Context) ([]entity.Syllabus, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]entity.Syllabus, len(r.syllabi))
	for i, s := range r.syllabi {
		result[i] = s
		result[i].Modules = nil
	}
	return result, nil
}

func (r *SyllabusRepository) ListSyllabiByLanguage(_ context.Context, language string) ([]entity.Syllabus, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	language = strings.ToLower(strings.TrimSpace(language))
	var result []entity.Syllabus
	for _, s := range r.syllabi {
		if strings.ToLower(s.Language) != language {
			continue
		}
		syllabus := s
		syllabus.Modules = nil
		result = append(result, syllabus)
	}
	return result, nil
}

func (r *SyllabusRepository) GetSyllabusByID(_ context.Context, id string) (*entity.Syllabus, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.syllabi {
		if s.ID == id {
			syllabus := cloneSyllabus(s)
			return &syllabus, nil
		}
	}
	return nil, nil
}

func (r *SyllabusRepository) ListModulesBySyllabusID(_ context.Context, syllabusID string) ([]entity.Module, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.syllabi {
		if s.ID == syllabusID {
			return append([]entity.Module(nil), s.Modules...), nil
		}
	}
	return nil, nil
}

func (r *SyllabusRepository) GetModuleByID(_ context.Context, moduleID string) (*entity.Module, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.syllabi {
		for _, m := range s.Modules {
			if m.ID == moduleID {
				module := m
				return &module, nil
			}
		}
	}
	return nil, nil
}

func (r *SyllabusRepository) SaveSyllabus(_ context.Context, syllabus entity.Syllabus) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, s := range r.syllabi {
		if s.ID == syllabus.ID {
			r.syllabi[i] = cloneSyllabus(syllabus)
			return nil
		}
	}
	r.syllabi = append(r.syllabi, cloneSyllabus(syllabus))
	return nil
}

func (r *SyllabusRepository) SaveModule(_ context.Context, module entity.Module) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, s := range r.syllabi {
		if s.ID != module.SyllabusID {
			continue
		}
		for j, existing := range s.Modules {
			if existing.ID == module.ID {
				r.syllabi[i].Modules[j] = module
				return nil
			}
		}
		r.syllabi[i].Modules = append(r.syllabi[i].Modules, module)
		return nil
	}

	r.syllabi = append(r.syllabi, entity.Syllabus{
		ID:      module.SyllabusID,
		Modules: []entity.Module{module},
	})
	return nil
}

func GetSyllabi() []entity.Syllabus {
	result, _ := defaultSyllabusRepository.ListSyllabi(context.Background())
	return result
}

func GetSyllabusByID(id string) *entity.Syllabus {
	syllabus, _ := defaultSyllabusRepository.GetSyllabusByID(context.Background(), id)
	return syllabus
}

func GetModulesBySyllabusID(syllabusID string) []entity.Module {
	modules, _ := defaultSyllabusRepository.ListModulesBySyllabusID(context.Background(), syllabusID)
	return modules
}

func GetModuleByID(moduleID string) *entity.Module {
	module, _ := defaultSyllabusRepository.GetModuleByID(context.Background(), moduleID)
	return module
}

func cloneSyllabus(s entity.Syllabus) entity.Syllabus {
	s.Translations = append([]entity.SyllabusTranslation(nil), s.Translations...)
	s.Modules = append([]entity.Module(nil), s.Modules...)
	return s
}
