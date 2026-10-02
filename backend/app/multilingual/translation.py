"""AI-SENIOR-X Markdown & Code-Aware Translation Engine."""

import re

from pydantic import BaseModel

from backend.app.llm.provider import BaseLLMProvider, LLMMessage
from backend.app.multilingual.supported_languages import SUPPORTED_LANGUAGES
from backend.app.multilingual.terminology import TechnicalTerminologyKeeper


class TranslationResult(BaseModel):
    """Result of educational translation."""

    source_language: str
    target_language: str
    original_text: str
    translated_text: str
    preserved_code_blocks_count: int


class MultilingualTranslator:
    """Translates educational prose while strictly preserving Markdown, code blocks, and formulas."""

    def __init__(self, llm_provider: BaseLLMProvider | None = None):
        self.llm_provider = llm_provider

    async def translate_text(
        self,
        text: str,
        target_language: str,
        source_language: str = "en",
    ) -> TranslationResult:
        """Translate educational text into target language while preserving technical artifacts."""
        if target_language == source_language or not text.strip():
            return TranslationResult(
                source_language=source_language,
                target_language=target_language,
                original_text=text,
                translated_text=text,
                preserved_code_blocks_count=0,
            )

        target_meta = SUPPORTED_LANGUAGES.get(target_language, SUPPORTED_LANGUAGES["en"])

        # 1. Mask fenced code blocks to prevent syntax corruption
        code_blocks: list[str] = []

        def code_replacer(match: re.Match) -> str:
            code_blocks.append(match.group(0))
            return f"__CODE_BLOCK_{len(code_blocks) - 1}__"

        masked_text = re.sub(r"```[\s\S]*?```", code_replacer, text)

        # 2. Translate using LLM if available
        if self.llm_provider:
            terminology_prompt = TechnicalTerminologyKeeper.get_prompt_instruction(target_meta.name)
            messages = [
                LLMMessage(
                    role="system",
                    content=(
                        f"You are an expert technical educational translator for AI-SENIOR-X.\n"
                        f"Translate the following educational markdown text into {target_meta.name} ({target_meta.native_name}).\n"
                        f"Strictly preserve placeholders like __CODE_BLOCK_0__, __CODE_BLOCK_1__ exactly as written.\n"
                        f"{terminology_prompt}"
                    ),
                ),
                LLMMessage(role="user", content=masked_text),
            ]
            response = await self.llm_provider.generate(messages, temperature=0.3)
            translated_masked = response.text.strip()
        else:
            # Fallback if no LLM provider is attached (e.g. offline unit test)
            translated_masked = masked_text

        # 3. Restore fenced code blocks
        final_text = translated_masked
        for idx, block in enumerate(code_blocks):
            final_text = final_text.replace(f"__CODE_BLOCK_{idx}__", block)

        return TranslationResult(
            source_language=source_language,
            target_language=target_language,
            original_text=text,
            translated_text=final_text,
            preserved_code_blocks_count=len(code_blocks),
        )
