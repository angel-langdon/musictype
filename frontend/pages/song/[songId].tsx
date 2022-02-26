import LoadingSpinner from "components/LoadingSpinner";
import TypingTest from "components/TypingTest";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Song } from "api/models";
import { doApiCall } from "api/client";
import LetterHeight from "components/LetterHeight";

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
  const [letterHeight, setLetterHeight] = useState(-1);

  useEffect(() => {
    if (typeof songId !== "string") return;
    loadSong(songId, setSong);
  }, [songId, setSong]);

  return (
    <div>
      {!song || letterHeight === -1 ? (
        <LoadingSpinner />
      ) : (
        <TypingTest song={song} letterHeight={letterHeight} />
      )}
      <LetterHeight setHeigth={setLetterHeight} />
    </div>
  );
}
