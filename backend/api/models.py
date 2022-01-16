import datetime
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

    slug: str = Field(index=True, sa_column_kwargs={"unique": True})
    title: str = Field(index=True)
    original_lyrics: Optional[str]
    author: str = Field(index=True)
    lyrics: Optional[str]


class SongSearch(SQLModel):
    slug: str
    title: str
    author: str


class Search(SQLModel):
    query: str = Field(primary_key=True)
    page: int = Field(primary_key=True)
    date: datetime.datetime = Field(default_factory=datetime.datetime.now)
