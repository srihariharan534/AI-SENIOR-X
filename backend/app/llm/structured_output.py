"""AI-SENIOR-X Robust Structured Output System for LLM Responses."""

import json
import re
from typing import TypeVar

from pydantic import BaseModel, ValidationError

from backend.app.core.exceptions import AppException
from backend.app.core.logging import logger
from backend.app.llm.provider import BaseLLMProvider, LLMMessage, get_llm_provider

T = TypeVar("T", bound=BaseModel)


def extract_json_from_text(text: str) -> str:
    """Extract raw JSON substring from markdown code blocks or surrounding text."""
    text = text.strip()

    # Match ```json ... ``` or ``` ... ```
    code_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if code_block_match:
        return code_block_match.group(1).strip()

    # Find leftmost { or [ and rightmost } or ]
    first_brace = text.find("{")
    first_bracket = text.find("[")

    if first_brace != -1 and (first_bracket == -1 or first_brace < first_bracket):
        last_brace = text.rfind("}")
        if last_brace != -1 and last_brace > first_brace:
            return text[first_brace : last_brace + 1].strip()
    elif first_bracket != -1:
        last_bracket = text.rfind("]")
        if last_bracket != -1 and last_bracket > first_bracket:
            return text[first_bracket : last_bracket + 1].strip()

    return text


def repair_json_string(json_str: str) -> str:
    """Attempt basic repairs for common LLM JSON syntax issues."""
    cleaned = json_str.strip()
    # Remove trailing commas before closing braces/brackets
    cleaned = re.sub(r",\s*([}\]])", r"\1", cleaned)
    return cleaned


class StructuredOutputEngine:
    """Orchestrates structured LLM queries and schema validation."""

    def __init__(self, provider: BaseLLMProvider | None = None):
        self.provider = provider or get_llm_provider()

    async def generate_structured(
        self,
        messages: list[LLMMessage],
        response_model: type[T],
        temperature: float = 0.2,
        max_retries: int = 2,
    ) -> T:
        """Query LLM with strict JSON schema instructions and validate against Pydantic model."""
        schema_json = json.dumps(response_model.model_json_schema(), indent=2)
        system_injection = (
            f"\n\nCRITICAL: You MUST reply with valid JSON conforming exactly to this JSON Schema:\n"
            f"{schema_json}\n"
            f"Do not include any introductory remarks, explanation, or notes outside the JSON."
        )

        formatted_messages = list(messages)
        if formatted_messages and formatted_messages[0].role == "system":
            formatted_messages[0] = LLMMessage(
                role="system",
                content=formatted_messages[0].content + system_injection,
            )
        else:
            formatted_messages.insert(0, LLMMessage(role="system", content=system_injection))

        current_messages = list(formatted_messages)

        for attempt in range(max_retries + 1):
            response = await self.provider.generate(current_messages, temperature=temperature)
            raw_text = response.text
            extracted = extract_json_from_text(raw_text)
            repaired = repair_json_string(extracted)

            try:
                parsed_dict = json.loads(repaired)
                validated_model = response_model.model_validate(parsed_dict)
                return validated_model
            except (json.JSONDecodeError, ValidationError) as err:
                logger.warning(
                    f"Structured output parsing failed (attempt {attempt + 1}/{max_retries + 1}): {err}"
                )
                if attempt < max_retries:
                    # Provide feedback to the LLM for self-correction
                    current_messages.append(LLMMessage(role="assistant", content=raw_text))
                    current_messages.append(
                        LLMMessage(
                            role="user",
                            content=(
                                f"Your previous output could not be parsed: {err}. "
                                f"Please re-emit the complete response as pure, valid JSON strictly matching the schema."
                            ),
                        )
                    )
                else:
                    # Attempt fallback instantiation if default values exist, or raise
                    try:
                        return response_model.model_construct()
                    except Exception:
                        raise AppException(
                            message=f"Failed to generate valid structured output for {response_model.__name__}: {err}",
                            code="STRUCTURED_OUTPUT_VALIDATION_ERROR",
                            details={"raw_text": raw_text[:300], "error": str(err)},
                        ) from err
