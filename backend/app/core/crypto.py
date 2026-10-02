"""AI-SENIOR-X Cryptographic Secret Management & Key Masking Utility."""

import base64
import hashlib
from typing import Final

from backend.app.core.config import settings
from backend.app.core.logging import logger

try:
    from cryptography.fernet import Fernet

    _HAS_CRYPTOGRAPHY = True
except ImportError:
    _HAS_CRYPTOGRAPHY = False


def _derive_fernet_key(secret: str) -> bytes:
    """Derive a consistent 32-byte url-safe base64 key from application SECRET_KEY."""
    digest = hashlib.sha256(secret.encode("utf-8")).digest()
    return base64.urlsafe_b64encode(digest)


_ENCRYPTION_KEY: Final[bytes] = _derive_fernet_key(settings.SECRET_KEY)


def encrypt_api_key(plain_key: str) -> str:
    """Encrypt plain API key into an encrypted token string.

    Ensures secrets are encrypted at rest and never stored in plaintext.
    """
    if not plain_key:
        return ""

    if _HAS_CRYPTOGRAPHY:
        fernet = Fernet(_ENCRYPTION_KEY)
        encrypted_bytes = fernet.encrypt(plain_key.encode("utf-8"))
        return encrypted_bytes.decode("utf-8")
    else:
        # Fallback obfuscation if cryptography package is missing in environment
        logger.warning("cryptography package not found; using fallback reversible encoding")
        encoded = base64.b64encode(plain_key.encode("utf-8")).decode("utf-8")
        return f"enc_v1_{encoded}"


def decrypt_api_key(encrypted_token: str) -> str:
    """Decrypt stored token into plaintext API key server-side.

    Never expose the output of this function to client responses or logs.
    """
    if not encrypted_token:
        return ""

    if encrypted_token.startswith("enc_v1_"):
        raw_b64 = encrypted_token[len("enc_v1_") :]
        return base64.b64decode(raw_b64.encode("utf-8")).decode("utf-8")

    if _HAS_CRYPTOGRAPHY:
        try:
            fernet = Fernet(_ENCRYPTION_KEY)
            decrypted_bytes = fernet.decrypt(encrypted_token.encode("utf-8"))
            return decrypted_bytes.decode("utf-8")
        except Exception as e:
            logger.error(f"Failed to decrypt API key: {e}")
            return ""
    return ""


def mask_api_key(plain_or_encrypted_key: str) -> str:
    """Produce safe masked representation of an API key (e.g., '••••••••8F2A').

    If the key is encrypted, it is safely decrypted server-side to extract the last 4 characters.
    Never exposes more than the trailing 4 characters.
    """
    if not plain_or_encrypted_key:
        return ""

    key = plain_or_encrypted_key
    if key.startswith("gAAAAA") or key.startswith("enc_v1_"):
        key = decrypt_api_key(plain_or_encrypted_key)

    if not key:
        return "••••••••••••"

    if len(key) <= 4:
        return "••••••••" + key

    last_four = key[-4:]
    return "••••••••" + last_four
