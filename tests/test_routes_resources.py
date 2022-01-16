from fastapi.testclient import TestClient

from backend.api.routes.resources import ROUTE_SEARCH_SONGS

_MOUNT = "api/resources/"


def test_search_songs(client: TestClient):
    url_search = f"{_MOUNT}{ROUTE_SEARCH_SONGS}"
    print(url_search)
