"""Generic Base Repository with async SQLAlchemy 2.0 operations."""

from collections.abc import Sequence
from typing import Any, Generic, TypeVar

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Base repository class providing generic async CRUD functionality."""

    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id_val: Any) -> ModelType | None:
        """Fetch a single record by primary key."""
        result = await self.session.execute(select(self.model).where(self.model.id == id_val))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        """Fetch all records with offset-based pagination."""
        result = await self.session.execute(select(self.model).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, **kwargs: Any) -> ModelType:
        """Create and persist a new model instance."""
        instance = self.model(**kwargs)
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def update(self, id_val: Any, **kwargs: Any) -> ModelType | None:
        """Update an existing record attributes."""
        stmt = (
            update(self.model)
            .where(self.model.id == id_val)
            .values(**kwargs)
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(stmt)
        await self.session.flush()
        return await self.get_by_id(id_val)

    async def delete(self, id_val: Any) -> bool:
        """Delete a record by primary key."""
        stmt = delete(self.model).where(self.model.id == id_val)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return (result.rowcount or 0) > 0
