import pytest
from fastapi import status
from fastapi.testclient import TestClient

from backend.api.models import SongResponse, SongSearch

_MOUNT = "/api/resources/"


@pytest.fixture
def client(base_client: TestClient):
    base_client.base_url = base_client.base_url + _MOUNT
    return base_client


def _get_songs_response(client: TestClient, query: str):
    return client.get(
        "songs",
        params={"query": query},
    )


def _get_songs(client: TestClient, query: str = "hola") -> list[SongSearch]:
    resp = _get_songs_response(client, query)
    assert resp.status_code == status.HTTP_200_OK
    for song in resp.json():
        assert len(set(song) - set(SongSearch.__fields__)) == 0
    return [SongSearch(**song) for song in resp.json()]


def test_get_songs(client: TestClient):
    assert _get_songs(client)
    assert not _get_songs(client, query="kajdlajlsdjadjalkdjaldjlkdjaldjalsd")
    for query in ["", "a" * 91]:
        resp = _get_songs_response(client, query=query)
        assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_song(client: TestClient):
    url_song = "song/"
    # not saved lyrics
    song_search = _get_songs(client)[0]
    resp = client.get(url_song + str(song_search.id))
    assert resp.status_code == status.HTTP_200_OK
    assert len(set(resp.json()) - set(SongResponse.__fields__)) == 0
    song = SongResponse(**resp.json())
    assert len(song.lyrics) > 10
    # saved lyrics
    resp = client.get(url_song + str(song_search.id))
    assert resp.status_code == status.HTTP_200_OK
    assert len(set(resp.json()) - set(SongResponse.__fields__)) == 0
    song = SongResponse(**resp.json())
    assert len(song.lyrics) > 10
    # not found song
    resp = client.get(url_song + "not-found-song")
    assert resp.status_code == status.HTTP_404_NOT_FOUND
