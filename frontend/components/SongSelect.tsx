import { doApiCall } from "api/client";
import { SongSearch } from "api/models";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import LoadingSpinner from "./LoadingSpinner";

async function loadSongs(
  query: string,
  setSongs: Dispatch<SetStateAction<SongSearch[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  const [res] = await doApiCall("GET", "resources", "songs", {
    params: { query },
  });
  if (!res || res.status !== 200) return;
  const songs: SongSearch[] | any = res.data;
  setSongs(songs);
  setIsLoading(false);
}

function useDelayedSearch(
  query: string,
  setSongs: Dispatch<SetStateAction<SongSearch[]>>,
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

export default function SongSelect() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<SongSearch[]>([]);

  let isLoading = useDelayedSearch(query, setSongs);

  return (
    <div
      className="flex flex-col w-[60vw] bg-slate-700 pretty-container relative transition-all overflow-hidden"
      style={songs.length > 0 || isLoading ? { height: "75%" } : { height: 64 }}
    >
      <div className="input text-white p-5">
        <BiSearchAlt2 />
        <input
          className="primary w-full"
          placeholder="Search a song..."
          value={query}
          ref={(ref) => ref && ref.focus()}
          maxLength={90}
          onChange={(e) => setQuery(e.target.value)}
          tabIndex={1}
        ></input>
      </div>
      {query === "" ? null : <Results songs={songs} isLoading={isLoading} />}
    </div>
  );
}

function Results(props: { songs: SongSearch[]; isLoading: boolean }) {
  if (props.isLoading)
    return (
      <div className="flex flex-grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="flex flex-col flex-grow overflow-y-scroll overflow-x-clip">
      {props.songs.map((song, idx) => (
        <Link key={`${song.author}-${song.title}`} href={`song${song.id}`}>
          <a
            className="flex flex-col hover:bg-slate-800 cursor-pointer px-6 py-4 whitespace-nowrap group"
            tabIndex={idx + 1}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.click();
              }
            }}
          >
            <div className="block font-bold text-slate-400 text-ellipsis overflow-hidden">
              {song.title}
            </div>
            <div className="block overflow-hidden text-ellipsis">
              {song.author}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
