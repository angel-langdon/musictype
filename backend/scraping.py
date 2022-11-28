import json
import re
import unicodedata

import httpx
from bs4 import BeautifulSoup

from backend.api.models import Song
from backend.song_utils import clean_text

re_lyrics_container = re.compile("^Lyrics__Container")

req_config = {"timeout": 20}
HOST = "https://genius.com"
API_HOST = f"{HOST}/api/"


def get_song_info(slug: str) -> Song | None:
    def lyrics() -> str:
        for br in soup.find_all("br"):
            br.replace_with("\n")

        text_lines: list[str] = []
        for elem in soup.find_all(class_=re_lyrics_container):
            text_lines.append(elem.text)
        return "\n\n".join(text_lines)

    resp = httpx.get(f"{HOST}/{slug}", **req_config)
    if resp.status_code != 200:
        return None
    soup = BeautifulSoup(resp.content, "lxml")

    html_title = (
        soup.find("title")
        .text.replace("\xa0", " ")
        .replace(" Lyrics | Genius Lyrics", "")
    )
    author, title = html_title.split(" – ")

    return Song(id=slug, author=author, title=title, lyrics=lyrics())


def search_songs(query: str, page: int = 1) -> list[Song]:
    url = f"{API_HOST}search/song"
    resp = httpx.get(url, params={"q": query, "page": page}, **req_config)

    content = unicodedata.normalize("NFKD", resp.content.decode())
    dic = json.loads(content)
    songs: list[Song] = []
    for song_dict in dic["response"]["sections"][0]["hits"]:
        hit = song_dict["result"]
        title = clean_text(hit["title"])
        author = clean_text(hit["artist_names"])
        songs.append(
            Song(
                id=hit["path"],
                title=title,
                author=author,
            )
        )
    return songs
