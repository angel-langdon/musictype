from typing import Optional

from pydantic import BaseModel, validator
from sqlmodel import Field, SQLModel

from backend import song_utils


class Song(SQLModel):
    id: str
    title: str
    author: str
    lyrics: Optional[str] = None


class SongSearch(BaseModel):
    id: str
    title: str
    author: str


class SongResponse(BaseModel):
    id: str
    title: str
    author: str
    lyrics: str

    @validator("lyrics")
    def clean_lyrics(cls, value: str):  # noqa: N805
        return song_utils.clean_lyrics(value)
