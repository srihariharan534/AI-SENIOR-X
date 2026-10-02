"""Unit tests for security and token management."""

import pytest

from backend.app.core.exceptions import AuthenticationException
from backend.app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)


def test_password_hashing():
    raw_password = "SuperSecretPassword123!"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_access_token_lifecycle():
    user_id = "user-uuid-12345"
    token = create_access_token(subject=user_id, extra_claims={"role": "learner"})

    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["role"] == "learner"
    assert payload["type"] == "access"


def test_jwt_refresh_token():
    user_id = "user-uuid-67890"
    token = create_refresh_token(subject=user_id)

    payload = decode_token(token)
    assert payload["sub"] == user_id
    assert payload["type"] == "refresh"


def test_invalid_token_decoding():
    with pytest.raises(AuthenticationException):
        decode_token("invalid.malformed.token")
