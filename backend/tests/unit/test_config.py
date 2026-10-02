"""Unit tests for configuration system."""

from backend.app.core.config import Settings


def test_settings_initialization():
    settings = Settings(
        PROJECT_NAME="TEST-APP",
        ENVIRONMENT="testing",
        SECRET_KEY="test-secret-long-enough-for-validation",
    )
    assert settings.PROJECT_NAME == "TEST-APP"
    assert settings.is_testing is True
    assert settings.is_production is False


def test_cors_origins_parsing():
    settings = Settings(
        CORS_ORIGINS='["http://localhost:3000","http://example.com"]',
        SECRET_KEY="test-secret-long-enough-for-validation",
    )
    assert "http://localhost:3000" in settings.CORS_ORIGINS
    assert "http://example.com" in settings.CORS_ORIGINS
