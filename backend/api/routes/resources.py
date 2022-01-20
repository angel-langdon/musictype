import datetime

import fastapi
from sqlmodel import desc, or_, select, Session

from backend import scraping, settings
from backend.api.dependencies import db_session, search_model
from backend.api.models import Search, Song, SongSearch

router = fastapi.APIRouter()


def _search_is_outdated(search: Search) -> bool:
    time_diff: datetime.timedelta = datetime.datetime.now() - search.date
    return time_diff > settings.SEARCH_CACHE_EXPIRATION


def _insert_new_songs(songs: list[Song], session: Session):
    slugs = [song.g_slug for song in songs]
    present_slugs = set(
        session.exec(select(Song.g_slug).where(Song.g_slug in slugs)).all()
    )
    songs = [song for song in songs if song not in present_slugs]
    session.add_all(songs)
    session.commit()


ROUTE_SEARCH_SONGS = "/songs/search/"


@router.get(ROUTE_SEARCH_SONGS, response_model=list[SongSearch])
async def search_songs(
    query: str,
    search: Search = search_model,
    session: Session = db_session,
):
    """Search songs by query."""

    if _search_is_outdated(search):
        songs = await scraping.search_songs(query)
        search.date = datetime.datetime.now()
        _insert_new_songs([Song(**song.dict()) for song in songs], session)
        return songs

    songs = session.exec(
        select(Song)
        .where(
            or_(Song.title.like(f"%{query}%"), Song.author.like(f"%{query}%"))
        )
        .order_by(desc(Song.g_views))
        .limit(10)
    ).all()
    return songs
