"""AI-SENIOR-X Language Router."""

from pydantic import BaseModel

from backend.app.multilingual.language_detector import DetectedLanguage, LanguageDetector
from backend.app.multilingual.supported_languages import (
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    LanguageConfig,
)
from backend.app.multilingual.terminology import TechnicalTerminologyKeeper


class LanguageRoutingDecision(BaseModel):
    """Decision on how to process input and emit response."""

    input_language: str
    response_language: str
    requires_translation: bool
    system_prompt_instruction: str
    voice_locale: str


class LanguageRouter:
    """Coordinates multilingual routing for incoming learner messages."""

    @classmethod
    def route_language(
        cls,
        user_text: str,
        user_explicit_preference: str | None = None,
        session_language: str | None = None,
    ) -> LanguageRoutingDecision:
        """Analyze message and decide input/response languages."""
        detected: DetectedLanguage = LanguageDetector.detect(
            user_text, user_preference=user_explicit_preference
        )

        # Response language priority:
        # 1. Explicit preference
        # 2. Session language
        # 3. Detected language from input
        # 4. Default "en"
        response_lang = user_explicit_preference or session_language or detected.language_code
        if response_lang not in SUPPORTED_LANGUAGES:
            response_lang = DEFAULT_LANGUAGE

        lang_cfg: LanguageConfig = SUPPORTED_LANGUAGES.get(
            response_lang, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE]
        )
        requires_trans = response_lang != "en"
        instruction = TechnicalTerminologyKeeper.get_prompt_instruction(lang_cfg.name)

        return LanguageRoutingDecision(
            input_language=detected.language_code,
            response_language=response_lang,
            requires_translation=requires_trans,
            system_prompt_instruction=instruction,
            voice_locale=lang_cfg.voice_locale,
        )
