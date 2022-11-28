import fastapi
from fastapi import Query

from backend import scraping
from backend.api.dependencies import song_model
from backend.api.models import Song, SongResponse, SongSearch

router = fastapi.APIRouter(prefix="/resources")


@router.get("/songs", response_model=list[SongSearch])
def get_songs(query: str = Query(..., min_length=1, max_length=90)):
    """Search songs by query."""

    songs = scraping.search_songs(query)
    return songs


@router.get("/song/{slug}", response_model=SongResponse)
def get_song(song: Song = song_model):
    """Get song"""
    return song
