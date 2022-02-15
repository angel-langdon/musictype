import { doApiCall } from "api/client";
import { Song } from "api/models";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  setSong: Dispatch<SetStateAction<Song | null>>;
}

async function loadSongs(
  query: string,
  setSongs: Dispatch<SetStateAction<Song[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const [res] = await doApiCall("GET", "resources", "songs/search", {
    params: { query },
  });
  if (!res || res.status !== 200) return;
  const songs: Song[] | any = res.data;
  setSongs(songs);
  setIsLoading(false);
}

function useDelayedSearch(
  query: string,
  setSongs: Dispatch<SetStateAction<Song[]>>,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const [delayedQuery, setDelayedQuery] = useState("");
  useEffect(() => {
    const MILISECONDS_UNTIL_START_SEARCH = 0.5 * 1000;
    if (query === "") setIsLoading(false);
    else setIsLoading(true);
    const delayedSearch = setTimeout(() => {
      setDelayedQuery(query);
    }, MILISECONDS_UNTIL_START_SEARCH);
    return () => clearTimeout(delayedSearch);
  }, [query, setDelayedQuery]);

  useEffect(() => {
    if (delayedQuery === "") return;
    setIsLoading(true);
  }, [delayedQuery, setIsLoading]);

  useEffect(() => {
    if (!isLoading) return;
    loadSongs(delayedQuery, setSongs, setIsLoading);
  }, [isLoading, delayedQuery, setSongs]);
}

export default function SongSelect(props: Props) {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useDelayedSearch(query, setSongs, isLoading, setIsLoading);

  return (
    <div className="flex flex-grow">
      <div className="flex flex-col w-[50vw] h-[80%] bg-slate-700 pretty-rectangle">
        <div className="input text-white">
          <BiSearchAlt2 />
          <input
            className="primary"
            placeholder="Search a song..."
            value={query}
            autoFocus={true}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
        </div>
        <Results songs={songs} isLoading={isLoading} />
      </div>
    </div>
  );
}

function Results(props: { songs: Song[]; isLoading: boolean }) {
  console.log(props.isLoading, props.songs);
  if (props.isLoading)
    return (
      <div className="flex flex-grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="flex flex-col">
      {props.songs.map((song) => (
        <div key={`${song.author}-${song.title}`}>{song.title}</div>
      ))}
    </div>
  );
}
