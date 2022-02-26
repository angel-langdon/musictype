export interface SongSearch {
  id: string;
  author: string;
  title: string;
}

export interface Song extends SongSearch {
  lyrics: string;
}
