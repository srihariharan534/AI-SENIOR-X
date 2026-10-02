"""Unit tests for Pydantic validation schemas."""

import pytest
from pydantic import ValidationError

from backend.app.schemas.auth import LoginRequest
from backend.app.schemas.user import UserCreate


def test_user_create_validation():
    valid = UserCreate(
        email="valid@example.com",
        password="SecurePassword123!",
        full_name="Valid User",
    )
    assert valid.email == "valid@example.com"

    with pytest.raises(ValidationError):
        UserCreate(
            email="not-an-email",
            password="short",
            full_name="U",
        )


def test_login_request_validation():
    valid = LoginRequest(email="test@example.com", password="password")
    assert valid.email == "test@example.com"

    with pytest.raises(ValidationError):
        LoginRequest(email="invalid", password="")
