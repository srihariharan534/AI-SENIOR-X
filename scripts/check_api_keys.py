"""Script to test and verify all configured AI Provider API Keys in AI-SENIOR-X."""

import asyncio
import os
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from backend.app.core.config import settings
from backend.app.core.crypto import mask_api_key
from backend.app.llm.provider import (
    GeminiProvider,
    GroqProvider,
    NvidiaNimProvider,
    OpenAIProvider,
    OpenRouterProvider,
)
from backend.app.database.session import AsyncSessionLocal
from backend.app.services.ai_provider_service import AIProviderService


async def test_all_keys():
    print("=" * 65)
    print("AI-SENIOR-X // AI PROVIDER API KEY HEALTH & VALIDATION SUITE")
    print("=" * 65)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Default LLM Provider: {settings.LLM_PROVIDER}")
    print(f"Default Model: {settings.LLM_MODEL}")
    print("-" * 65)

    # 1. Check Environment Variables
    env_keys = {
        "google_gemini": os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY,
        "openrouter": os.getenv("OPENROUTER_API_KEY") or settings.OPENROUTER_API_KEY,
        "groq": os.getenv("GROQ_API_KEY") or settings.GROQ_API_KEY,
        "nvidia_nim": os.getenv("NVIDIA_NIM_API_KEY") or settings.NVIDIA_NIM_API_KEY,
        "openai": os.getenv("OPENAI_API_KEY") or settings.OPENAI_API_KEY,
        "anthropic": os.getenv("ANTHROPIC_API_KEY") or settings.ANTHROPIC_API_KEY,
    }

    print("\n[1] ENVIRONMENT VARIABLE SCAN:")
    for prov_name, key in env_keys.items():
        if key and key.strip() and not key.startswith("your_"):
            print(f"  ✓ {prov_name:<15}: CONFIGURED ({mask_api_key(key)})")
        else:
            print(f"  ○ {prov_name:<15}: NOT CONFIGURED (Empty / placeholder)")

    # 2. Test Live Connections for Configured Environment Keys
    print("\n[2] LIVE CONNECTION VERIFICATION:")
    
    test_targets = [
        ("google_gemini", env_keys["google_gemini"], GeminiProvider, "gemini-1.5-flash"),
        ("openrouter", env_keys["openrouter"], OpenRouterProvider, "google/gemini-flash-1.5"),
        ("groq", env_keys["groq"], GroqProvider, "llama-3.1-8b-instant"),
        ("nvidia_nim", env_keys["nvidia_nim"], NvidiaNimProvider, "meta/llama3-70b-instruct"),
        ("openai", env_keys["openai"], OpenAIProvider, "gpt-4o-mini"),
    ]

    any_env_tested = False
    for name, api_key, ProviderClass, default_model in test_targets:
        if not api_key or not api_key.strip() or api_key.startswith("your_"):
            continue

        any_env_tested = True
        print(f"\nTesting provider: {name.upper()}...")
        provider_instance = ProviderClass(api_key=api_key, default_model=default_model)
        success, message, latency = await provider_instance.test_connection()
        status_symbol = "✓" if success else "✗"
        status_text = "CONNECTED" if success else "FAILED"
        print(f"  Status : {status_symbol} {status_text} ({latency:.1f}ms)")
        print(f"  Details: {message}")

        if success:
            models = await provider_instance.list_models()
            print(f"  Available models discovered: {len(models)}")
            if models:
                sample = [m.model_name for m in models[:3]]
                print(f"  Sample models: {', '.join(sample)}")

    if not any_env_tested:
        print("  (No live environment API keys provided yet in .env)")

    # 3. Check Database Stored Providers (Settings / Developer Field Kit)
    print("\n[3] DATABASE STORED SECURE PROVIDER CONFIGURATIONS:")
    try:
        from backend.app.database.base import Base
        import backend.app.database.models  # noqa: F401
        from backend.app.database.session import async_engine

        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with AsyncSessionLocal() as session:
            service = AIProviderService()
            db_providers = await service.get_all_providers(session)
            if not db_providers:
                print("  ○ No provider credentials stored in database yet.")
            else:
                for prov in db_providers:
                    status_val = prov.status.value.upper() if hasattr(prov.status, "value") else str(prov.status).upper()
                    print(f"  • {prov.name:<16} ({prov.provider:<10}): {status_val:<13} | Default Model: {prov.default_model:<28} | Key: {prov.masked_key}")
    except Exception as e:
        print(f"  ○ Database check notice: {e}")

    print("\n" + "=" * 65)
    print("VALIDATION COMPLETE")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(test_all_keys())
