"""AI-SENIOR-X Fast Deterministic Language Detector."""

import re

from pydantic import BaseModel, Field

from backend.app.multilingual.supported_languages import DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES


class DetectedLanguage(BaseModel):
    """Result of language detection."""

    language_code: str
    language_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    detection_method: str = "script_heuristic"


class LanguageDetector:
    """Detects text language accurately and rapidly without external API overhead."""

    # Unicode script ranges
    SCRIPT_PATTERNS = [
        (re.compile(r"[\u0900-\u097F]"), "hi"),  # Devanagari
        (re.compile(r"[\u0B80-\u0BFF]"), "ta"),  # Tamil
        (re.compile(r"[\u0C00-\u0C7F]"), "te"),  # Telugu
        (re.compile(r"[\u0980-\u09FF]"), "bn"),  # Bengali
        (re.compile(r"[\u3040-\u30FF]"), "ja"),  # Japanese Hiragana/Katakana
        (re.compile(r"[\u4E00-\u9FFF]"), "zh"),  # Chinese Han
    ]

    # Stopwords / Distinctive n-grams for Latin-based languages
    LATIN_KEYWORDS = {
        "es": {
            "el",
            "la",
            "los",
            "las",
            "un",
            "una",
            "de",
            "que",
            "y",
            "en",
            "por",
            "para",
            "como",
            "sobre",
            "explicar",
            "entender",
            "ejemplo",
            "aprendizaje",
        },
        "fr": {
            "le",
            "la",
            "les",
            "un",
            "une",
            "des",
            "du",
            "de",
            "et",
            "en",
            "que",
            "qui",
            "dans",
            "pour",
            "avec",
            "comment",
            "comprendre",
            "exemple",
        },
        "de": {
            "der",
            "die",
            "das",
            "den",
            "dem",
            "des",
            "ein",
            "eine",
            "und",
            "in",
            "zu",
            "von",
            "mit",
            "nicht",
            "wie",
            "verstehen",
            "beispiel",
        },
    }

    @classmethod
    def detect(cls, text: str, user_preference: str | None = None) -> DetectedLanguage:
        """Detect language of the provided text string."""
        cleaned = text.strip()
        if not cleaned:
            code = user_preference if user_preference in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE
            return DetectedLanguage(
                language_code=code,
                language_name=SUPPORTED_LANGUAGES[code].name,
                confidence=1.0 if user_preference else 0.5,
                detection_method="user_preference_fallback"
                if user_preference
                else "default_fallback",
            )

        # 1. Non-Latin Unicode Script matching
        for pattern, code in cls.SCRIPT_PATTERNS:
            matches = pattern.findall(cleaned)
            if len(matches) >= 2:
                ratio = len(matches) / max(1, len(cleaned.replace(" ", "")))
                confidence = min(0.99, max(0.65, ratio * 2.0))
                return DetectedLanguage(
                    language_code=code,
                    language_name=SUPPORTED_LANGUAGES[code].name,
                    confidence=round(confidence, 2),
                    detection_method="unicode_script_analysis",
                )

        # 2. Latin Keyword lexical analysis
        words = set(re.findall(r"\b\w{2,}\b", cleaned.lower()))
        best_code = DEFAULT_LANGUAGE
        best_score = 0

        for code, vocab in cls.LATIN_KEYWORDS.items():
            overlap = len(words.intersection(vocab))
            if overlap > best_score:
                best_score = overlap
                best_code = code

        if best_score >= 2:
            return DetectedLanguage(
                language_code=best_code,
                language_name=SUPPORTED_LANGUAGES[best_code].name,
                confidence=min(0.95, 0.50 + best_score * 0.15),
                detection_method="latin_ngram_analysis",
            )

        # 3. Fallback to user preference or default English
        chosen_code = (
            user_preference if user_preference in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE
        )
        return DetectedLanguage(
            language_code=chosen_code,
            language_name=SUPPORTED_LANGUAGES[chosen_code].name,
            confidence=0.85 if chosen_code == "en" else 0.70,
            detection_method="contextual_default",
        )
