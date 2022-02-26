import fastapi
from fastapi import Query
from sqlmodel import Session

from backend import scraping, song_utils
from backend.api.dependencies import db_session, song_model
from backend.api.models import Song, SongSearch
from backend.sqlmodel_fix import select

router = fastapi.APIRouter(prefix="/resources")


def _upsert_songs(songs: list[Song], session: Session):
    present_songs = {
        slug: song_id
        for song_id, slug in session.exec(
            select(Song.id, Song.g_slug).where(
                Song.g_slug.in_([song.g_slug for song in songs])
            )
        ).all()
    }

    session.bulk_save_objects(
        [song for song in songs if song.g_slug not in present_songs]
    )
    session.commit()
    for song in songs:
        song.id = present_songs.get(song.g_slug, song.id)


@router.get("/songs/search", response_model=list[SongSearch])
def search_songs(
    query: str = Query(..., min_length=1, max_length=90),
    session: Session = db_session,
):
    """Search songs by query."""

    songs = scraping.search_songs(query)
    _upsert_songs(songs, session)
    return songs


@router.get("/song/{song_id}/lyrics", response_model=str)
def song_lyrics(song: Song = song_model, session: Session = db_session):
    """Get song lyrics"""
    if song.lyrics:
        return song_utils.clean_lyrics(song.lyrics)

    lyrics = scraping.get_song_lyrics_from_slug(song.g_slug)
    song.lyrics = lyrics
    session.add(song)
    session.commit()
    return song_utils.clean_lyrics(lyrics)
