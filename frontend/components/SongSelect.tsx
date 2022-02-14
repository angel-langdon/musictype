import { doApiCall } from "api/client";
import { Song } from "api/models";
import { Dispatch, SetStateAction, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";

interface Props {
  setSong: Dispatch<SetStateAction<Song | null>>;
}

async function loadSongs(
  query: string,
  setSongs: Dispatch<SetStateAction<Song[]>>
) {
  const [res] = await doApiCall("GET", "resources", "song/search", {
    params: { query },
  });
  if (!res || res.status !== 200) return;
  const songs: Song[] | any = res.data;
  setSongs(songs);
}

export default function SongSelect(props: Props) {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        <Results songs={songs} isLoading={false} />
      </div>
    </div>
  );
}

function Results(props: { songs: Song[]; isLoading: boolean }) {
  if (props.isLoading) return;
  return null;
}
