from fastapi import Depends, HTTPException

from backend import scraping
from backend.api.models import Song


def _get_song_model(slug: str) -> Song:
    song = scraping.get_song_info(slug)
    if song is None:
        raise HTTPException(
            status_code=404,
            detail=f"Song with id {slug} not found",
        )
    return song


song_model: Song = Depends(_get_song_model)
