import json
import re
import unicodedata

import httpx
from bs4 import BeautifulSoup

from backend.api.models import Song

re_lyrics_container = re.compile("^Lyrics__Container")


def get_song_lyrics(url: str) -> str:
    resp = httpx.get(url)
    soup = BeautifulSoup(resp.content, "lxml")

    for br in soup.find_all("br"):
        br.replace_with("\n")

    text_lines: list[str] = []
    for elem in soup.find_all(class_=re_lyrics_container):
        text_lines.append(elem.text)

    return "\n\n".join(text_lines)


def search_songs(query: str, page: int = 1) -> list[Song]:
    url = "https://genius.com/api/search/song"
    resp = httpx.get(url, params={"q": query, "page": page})

    content = unicodedata.normalize("NFKD", resp.content.decode())
    dic = json.loads(content)
    songs: list[Song] = []
    for song_dict in dic["response"]["sections"][0]["hits"]:
        hit = song_dict["result"]
        author: str = hit["full_title"].replace(hit["title"], "")
        songs.append(
            Song(
                title=hit["full_title"].replace(author, ""),
                author=author.strip().lstrip("by "),
                g_views=hit.get("stats", dict()).get("pageviews", 0),
                g_slug=hit["path"],
            )
        )
    return songs
