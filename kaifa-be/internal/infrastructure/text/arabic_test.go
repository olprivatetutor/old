package text

import "testing"

func TestRomanizeArabicText_PreservesEnglish(t *testing.T) {
	if got := RomanizeArabicText("speaking"); got != "speaking" {
		t.Fatalf("expected English text to stay unchanged, got %q", got)
	}
}

func TestRomanizeArabicText_RomanizesArabic(t *testing.T) {
	if got := RomanizeArabicText("السلام عليكم"); got != "As-salamu alaykum" {
		t.Fatalf("unexpected romanization: got %q", got)
	}
}
