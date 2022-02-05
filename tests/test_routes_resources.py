import pytest
from fastapi.testclient import TestClient

from backend.api.models import SongSearch
from backend.api.routes.resources import ROUTE_SEARCH_SONGS

_MOUNT = "/api/resources/"


@pytest.fixture
def client(base_client: TestClient):
    base_client.base_url = base_client.base_url + _MOUNT
    return base_client


def test_search_songs(client: TestClient):
    resp = client.get(ROUTE_SEARCH_SONGS[1:], params={"query": "hola"})
    assert resp.status_code == 200
    songs = [SongSearch(**song) for song in resp.json()]
    for song in songs:
        assert len(set(song.__fields__) - set(SongSearch.__fields__)) == 0
