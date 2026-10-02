"""AI-SENIOR-X Common API Response Schemas and Pagination."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ApiError(BaseModel):
    """Standardized error payload."""

    code: str
    message: str
    details: dict[str, Any] | None = None


class ApiResponse(BaseModel, Generic[DataT]):
    """Unified API response wrapper."""

    success: bool = True
    data: DataT | None = None
    error: ApiError | None = None


class PaginationParams(BaseModel):
    """Standard pagination query parameters."""

    skip: int = Field(0, ge=0, description="Offset records count")
    limit: int = Field(50, ge=1, le=100, description="Page limit")


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Standard paginated payload wrapper."""

    items: list[DataT]
    total: int
    skip: int
    limit: int
