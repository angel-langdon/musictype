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
  delaySeconds = 1
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (query === "") {
      setIsLoading(false);
      setSongs([]);
    } else setIsLoading(true);
    const delayedSearch = setTimeout(() => {
      if (query === "") return;
      loadSongs(query, setSongs, setIsLoading);
    }, delaySeconds * 1000);
    return () => clearTimeout(delayedSearch);
  }, [query, setSongs]);
  return isLoading;
}

export default function SongSelect(props: Props) {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);

  let isLoading = useDelayedSearch(query, setSongs);

  return (
    <div
      className="flex flex-col w-[50vw] bg-slate-700 pretty-container relative transition-all overflow-hidden"
      style={songs.length > 1 || isLoading ? { height: "75%" } : { height: 64 }}
    >
      <div className="input text-white p-5">
        <BiSearchAlt2 />
        <input
          className="primary"
          placeholder="Search a song..."
          value={query}
          autoFocus={true}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
      </div>
      {query === "" ? null : <Results songs={songs} isLoading={isLoading} />}
    </div>
  );
}

function Results(props: { songs: Song[]; isLoading: boolean }) {
  if (props.isLoading)
    return (
      <div className="flex flex-grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="flex flex-col flex-grow overflow-y-scroll overflow-x-clip">
      {props.songs.map((song) => (
        <div
          key={`${song.author}-${song.title}`}
          className="flex flex-col hover:bg-slate-800 cursor-pointer px-6 py-4 whitespace-nowrap group"
        >
          <div className="block font-bold text-slate-400 text-ellipsis overflow-hidden">
            {song.title}
          </div>
          <div className="block overflow-hidden text-ellipsis">
            {song.author}
          </div>
        </div>
      ))}
    </div>
  );
}
