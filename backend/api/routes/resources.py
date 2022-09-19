import fastapi
from fastapi import Query
from sqlmodel import col, select, Session

from backend import scraping
from backend.api.dependencies import db_session, song_model
from backend.api.models import Song, SongResponse, SongSearch

router = fastapi.APIRouter(prefix="/resources")


def _upsert_songs(songs: list[Song], session: Session):
    present_songs = {
        slug: song_id
        for song_id, slug in session.exec(
            select(Song.id, Song.g_slug).where(
                col(Song.g_slug).in_([song.g_slug for song in songs])
            )
        ).all()
    }

    session.bulk_save_objects(
        [song for song in songs if song.g_slug not in present_songs]
    )
    session.commit()
    for song in songs:
        song.id = present_songs.get(song.g_slug, song.id)


@router.get("/songs", response_model=list[SongSearch])
def get_songs(
    query: str = Query(..., min_length=1, max_length=90),
    session: Session = db_session,
):
    """Search songs by query."""

    songs = scraping.search_songs(query)
    _upsert_songs(songs, session)
    return songs


@router.get("/song/{song_id}", response_model=SongResponse)
def get_song(song: Song = song_model, session: Session = db_session):
    """Get song lyrics"""
    if song.lyrics:
        return song

    lyrics = scraping.get_song_lyrics_from_slug(song.g_slug)
    song.lyrics = lyrics
    session.add(song)
    session.commit()
    session.refresh(song)
    return song
