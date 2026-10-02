"""Unit tests for AI-SENIOR-X Multilingual Engine."""

import pytest

from backend.app.multilingual.language_detector import LanguageDetector
from backend.app.multilingual.language_router import LanguageRouter
from backend.app.multilingual.terminology import TechnicalTerminologyKeeper
from backend.app.multilingual.translation import MultilingualTranslator


def test_language_detection():
    # 1. Hindi (Devanagari)
    hindi_text = "मशीन लर्निंग और तंत्रिका नेटवर्क कैसे काम करते हैं?"
    res_hi = LanguageDetector.detect(hindi_text)
    assert res_hi.language_code == "hi"
    assert res_hi.confidence >= 0.70

    # 2. Tamil
    tamil_text = "பைதான் நிரலாக்கத்தில் செயற்கை நுண்ணறிவு எவ்வாறு செயல்படுகிறது?"
    res_ta = LanguageDetector.detect(tamil_text)
    assert res_ta.language_code == "ta"
    assert res_ta.confidence >= 0.70

    # 3. Spanish (Latin n-grams)
    es_text = (
        "Por favor explica el sobreajuste y la función de pérdida con un ejemplo de aprendizaje"
    )
    res_es = LanguageDetector.detect(es_text)
    assert res_es.language_code == "es"

    # 4. English Default
    en_text = "How does gradient descent minimize the loss function in deep neural networks?"
    res_en = LanguageDetector.detect(en_text)
    assert res_en.language_code == "en"


def test_terminology_preservation():
    instruction = TechnicalTerminologyKeeper.get_prompt_instruction("hi")
    assert "IMPORTANT MULTILINGUAL INSTRUCTION" in instruction
    assert "def" in instruction
    assert "Overfitting" in instruction

    assert (
        TechnicalTerminologyKeeper.contains_code_blocks("```python\ndef solve(): pass\n```") is True
    )
    assert (
        TechnicalTerminologyKeeper.contains_code_blocks("Plain explanation without code") is False
    )


def test_language_router():
    routing = LanguageRouter.route_language("செயற்கை நுண்ணறிவு")
    assert routing.input_language == "ta"
    assert routing.response_language == "ta"
    assert routing.requires_translation is True
    assert routing.voice_locale == "ta-IN"


@pytest.mark.asyncio
async def test_code_aware_translation_preservation():
    translator = MultilingualTranslator(llm_provider=None)  # Uses regex code masker fallback
    sample_markdown = (
        "Here is the function:\n"
        "```python\n"
        "def compute_loss(y_true, y_pred):\n"
        "    return (y_true - y_pred) ** 2\n"
        "```\n"
        "This computes the mean squared error."
    )
    result = await translator.translate_text(
        text=sample_markdown,
        target_language="es",
        source_language="en",
    )
    assert result.preserved_code_blocks_count == 1
    assert "def compute_loss" in result.translated_text
