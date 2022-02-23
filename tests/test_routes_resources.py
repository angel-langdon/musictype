import pytest
from fastapi import status
from fastapi.testclient import TestClient

from backend.api.models import new_uuid, SongSearch

_MOUNT = "/api/resources/"


@pytest.fixture
def client(base_client: TestClient):
    base_client.base_url = base_client.base_url + _MOUNT
    return base_client


def _get_songs_response(client: TestClient, query: str):
    return client.get(
        "songs/search",
        params={"query": query},
    )


def _get_songs(client: TestClient, query: str = "hola") -> list[SongSearch]:
    resp = _get_songs_response(client, query)
    assert resp.status_code == status.HTTP_200_OK
    for song in resp.json():
        assert len(set(song) - set(SongSearch.__fields__)) == 0
    return [SongSearch(**song) for song in resp.json()]


def test_search_songs(client: TestClient):
    assert _get_songs(client)
    assert not _get_songs(client, query="kajdlajlsdjadjalkdjaldjlkdjaldjalsd")
    for query in ["", "a" * 91]:
        resp = _get_songs_response(client, query=query)
        assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_song_lyrics(client: TestClient):
    url_lyrics = "song/lyrics/"
    # not saved lyrics
    song = _get_songs(client)[0]
    resp = client.get(url_lyrics + str(song.id))
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.content) > 10
    # saved lyrics
    resp = client.get(url_lyrics + str(song.id))
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.content) > 10
    # not found song
    resp = client.get(url_lyrics + str(new_uuid()))
    assert resp.status_code == status.HTTP_404_NOT_FOUND
    # invalid uuid
    resp = client.get(url_lyrics + "not_valid_uuid_format")
    assert resp.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
