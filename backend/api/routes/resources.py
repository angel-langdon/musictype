import fastapi

from backend import scraping
from backend.api.models import SongSearch

router = fastapi.APIRouter(prefix="/resources/")


ROUTE_SEARCH_SONGS = "/songs/search"


@router.get(ROUTE_SEARCH_SONGS, response_model=list[SongSearch])
async def search_songs(
    query: str,
):
    """Search songs by query."""

    songs = await scraping.search_songs(query)
    return songs
