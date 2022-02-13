from fastapi import Depends
from pydantic import UUID4
from sqlmodel import Session

from backend import settings
from backend.api.exceptions import resource_not_found_error
from backend.api.models import Song

db_session: Session = Depends(settings.get_db_session)


def _get_song_model(song_id: UUID4, session: Session = db_session) -> Song:
    song = session.get(Song, song_id)
    if song is None:
        raise resource_not_found_error(Song, song_id)
    return song


song_model: Song = Depends(_get_song_model)
