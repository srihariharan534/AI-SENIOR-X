"""AI-SENIOR-X Supported Languages Configuration."""

from dataclasses import dataclass


@dataclass(frozen=True)
class LanguageConfig:
    """Language descriptor and metadata."""

    code: str  # ISO 639-1 code
    name: str
    native_name: str
    script: str
    is_right_to_left: bool = False
    voice_locale: str = "en-US"


SUPPORTED_LANGUAGES: dict[str, LanguageConfig] = {
    "en": LanguageConfig(
        code="en", name="English", native_name="English", script="Latin", voice_locale="en-US"
    ),
    "es": LanguageConfig(
        code="es", name="Spanish", native_name="Español", script="Latin", voice_locale="es-ES"
    ),
    "hi": LanguageConfig(
        code="hi", name="Hindi", native_name="हिन्दी", script="Devanagari", voice_locale="hi-IN"
    ),
    "ta": LanguageConfig(
        code="ta", name="Tamil", native_name="தமிழ்", script="Tamil", voice_locale="ta-IN"
    ),
    "te": LanguageConfig(
        code="te", name="Telugu", native_name="తెలుగు", script="Telugu", voice_locale="te-IN"
    ),
    "bn": LanguageConfig(
        code="bn", name="Bengali", native_name="বাংলা", script="Bengali", voice_locale="bn-IN"
    ),
    "fr": LanguageConfig(
        code="fr", name="French", native_name="Français", script="Latin", voice_locale="fr-FR"
    ),
    "de": LanguageConfig(
        code="de", name="German", native_name="Deutsch", script="Latin", voice_locale="de-DE"
    ),
    "zh": LanguageConfig(
        code="zh", name="Chinese", native_name="中文", script="Han", voice_locale="zh-CN"
    ),
    "ja": LanguageConfig(
        code="ja", name="Japanese", native_name="日本語", script="Japanese", voice_locale="ja-JP"
    ),
}

DEFAULT_LANGUAGE = "en"
