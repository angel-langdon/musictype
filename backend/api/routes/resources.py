import fastapi

from backend import scraping
from backend.api.models import SongSearch

router = fastapi.APIRouter(prefix="/resources")


ROUTE_SEARCH_SONGS = "/songs/search"


@router.get(ROUTE_SEARCH_SONGS, response_model=list[SongSearch])
def search_songs(
    query: str,
):
    """Search songs by query."""

    return scraping.search_songs(query)
