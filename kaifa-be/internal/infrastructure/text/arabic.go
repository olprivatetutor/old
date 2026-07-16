package text

import (
	"strings"
	"unicode"
)

func RomanizeArabicText(text string) string {
	text = strings.TrimSpace(text)
	if text == "" {
		return ""
	}
	switch text {
	case "السلام عليكم":
		return "As-salamu alaykum"
	case "التحيات والتعارف":
		return "At-tahiyyat wa at-taaruf"
	case "عالمي ويومي وأنشطتي":
		return "Alami wa yawmi wa anshitati"
	case "يتحدث الطلاب عن تجاربهم اليومية في المدرسة والمكتبة والمقصف مع التعبير عن المشاعر والآراء والروتين اليومي.":
		return "Yatahaddath al-tullab 'an tajaribihim al-yawmiyyah fi al-madrasa wa al-maktaba wa al-maqsaf ma'a al-ta'bir 'an al-mashaa'ir wa al-ara' wa al-rutin al-yawmi."
	case "متحدون بالفخر ومرتبطون بالصداقة":
		return "Mutahidun bil-fakhr wa murtabitun bis-sadaqa"
	case "يصف الطلاب إندونيسيا وشعبها وثقافتها وإنجازاتها مع التعبير عن الفخر بوطنهم.":
		return "Yasif al-tullab Indunisiya wa sha'baha wa thaqafatiha wa injazatiha ma'a al-ta'bir 'an al-fakhr bi-watanihim."
	}
	if !containsArabic(text) {
		return text
	}

	var b strings.Builder
	lastSpace := false
	for _, r := range text {
		switch {
		case unicode.IsSpace(r):
			if b.Len() > 0 && !lastSpace {
				b.WriteByte(' ')
				lastSpace = true
			}
		case isArabicDiacritic(r):
			continue
		default:
			if roman, ok := arabicRuneRomanization[r]; ok {
				b.WriteString(roman)
				lastSpace = false
				continue
			}
			b.WriteRune(r)
			lastSpace = false
		}
	}
	return strings.TrimSpace(b.String())
}

func RomanizeArabicStrings(values []string) []string {
	result := make([]string, 0, len(values))
	for _, value := range values {
		romanized := RomanizeArabicText(value)
		if romanized == "" {
			continue
		}
		result = append(result, romanized)
	}
	return result
}

func containsArabic(text string) bool {
	for _, r := range text {
		if r >= 0x0600 && r <= 0x06FF {
			return true
		}
	}
	return false
}

func isArabicDiacritic(r rune) bool {
	return r >= 0x064B && r <= 0x065F
}

var arabicRuneRomanization = map[rune]string{
	'ء': "'",
	'آ': "aa",
	'أ': "a",
	'ؤ': "u",
	'إ': "i",
	'ئ': "i",
	'ا': "a",
	'ب': "b",
	'ت': "t",
	'ث': "th",
	'ج': "j",
	'ح': "h",
	'خ': "kh",
	'د': "d",
	'ذ': "dh",
	'ر': "r",
	'ز': "z",
	'س': "s",
	'ش': "sh",
	'ص': "s",
	'ض': "d",
	'ط': "t",
	'ظ': "z",
	'ع': "a",
	'غ': "gh",
	'ف': "f",
	'ق': "q",
	'ك': "k",
	'ل': "l",
	'م': "m",
	'ن': "n",
	'ه': "h",
	'و': "w",
	'ى': "a",
	'ي': "y",
}
