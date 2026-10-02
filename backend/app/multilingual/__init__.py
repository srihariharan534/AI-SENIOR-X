"""AI-SENIOR-X Multilingual Engine Module."""

from backend.app.multilingual.language_detector import DetectedLanguage, LanguageDetector
from backend.app.multilingual.language_router import LanguageRouter, LanguageRoutingDecision
from backend.app.multilingual.supported_languages import (
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    LanguageConfig,
)
from backend.app.multilingual.terminology import TechnicalTerminologyKeeper
from backend.app.multilingual.translation import MultilingualTranslator, TranslationResult

__all__ = [
    "DEFAULT_LANGUAGE",
    "DetectedLanguage",
    "LanguageConfig",
    "LanguageDetector",
    "LanguageRouter",
    "LanguageRoutingDecision",
    "MultilingualTranslator",
    "SUPPORTED_LANGUAGES",
    "TechnicalTerminologyKeeper",
    "TranslationResult",
]
