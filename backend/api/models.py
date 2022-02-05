import uuid
from typing import Optional

from pydantic import UUID4
from sqlmodel import Field, SQLModel


def new_uuid() -> uuid.UUID:
    """UUID factory (hack to avoid open issue)."""
    # TODO remove UUID factory hack when issue is solved
    # Note: Work around UUIDs with leading zeros:
    # https://github.com/tiangolo/sqlmodel/issues/25
    # by making sure uuid str does not start with a leading 0
    while (value := uuid.uuid4()).hex[0] == "0":
        pass
    return value


id_field: UUID4 = Field(
    default_factory=new_uuid,
    primary_key=True,
    nullable=False,
)


class Song(SQLModel, table=True):  # type: ignore
    id: UUID4 = id_field

    title: str = Field(index=True)
    author: str = Field(index=True)
    original_lyrics: Optional[str] = None
    lyrics: Optional[str] = None

    g_slug: str = Field(index=True, sa_column_kwargs={"unique": True})
    g_views: int = Field(index=True)


class SongSearch(SQLModel):
    id: UUID4
    title: str
    author: str
