import LoadingSpinner from "components/LoadingSpinner";
import TypingTest from "components/TypingTest/TypingTest";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Song } from "api/models";
import { doApiCall } from "api/client";
import LetterSize from "components/LetterSize";

async function loadSong(
  songId: string,
  setSong: Dispatch<SetStateAction<Song | null>>
) {
  const [res] = await doApiCall("GET", "resources", `song/${songId}`);
  if (!res || res.status !== 200) return;
  const song: Song | any = res.data;
  setSong(song);
}

export default function SongTypingTest() {
  const [song, setSong] = useState<Song | null>(null);
  const router = useRouter();
  const { songId } = router.query;
  const [letter, setLetter] = useState({ height: -1, width: -1 });
  const textSize = "text-xl";

  useEffect(() => {
    if (typeof songId !== "string") return;
    loadSong(songId, setSong);
  }, [songId, setSong]);

  return (
    <div className="flex flex-col items-center justify-center">
      {!song || letter.height === -1 || letter.width === -1 ? (
        <LoadingSpinner />
      ) : (
        <TypingTest song={song} textSize={textSize} letter={letter} />
      )}
      <LetterSize setLetter={setLetter} textSize={textSize} />
    </div>
  );
}
