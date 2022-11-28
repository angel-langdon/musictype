import LoadingSpinner from "components/LoadingSpinner";
import TypingTest from "components/TypingTest/TypingTest";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Song } from "api/models";
import { doApiCall } from "api/client";
import LetterSize from "components/LetterSize";
import Head from "next/head";

async function getSong(songId: string) {
  const [res, err] = await doApiCall("GET", "resources", `song/${songId}`);
  let code = 0;
  if (err?.response !== undefined) code = err.response.status;
  else if (res?.status) code = res.status;
  if (!res || res.status !== 200) return { song: null, code };
  const song = res.data as Song;
  return { song, code };
}

export default function SongTypingTest() {
  const [song, setSong] = useState<Song | null>(null);
  const [code, setCode] = useState<null | number>(null);
  const router = useRouter();
  const { songId } = router.query;
  const [letter, setLetter] = useState({ height: -1, width: -1 });
  const textSize = "text-xl";

  useEffect(() => {
    if (typeof songId !== "string") return;
    getSong(songId).then(({ song, code }) => {
      setSong(song);
      setCode(code);
    });
  }, [songId]);
  if (code === 404)
    return <div className="text-white text-xl">Song not found</div>;
  return (
    <div className="flex flex-col items-center justify-center">
      {!song || letter.height === -1 || letter.width === -1 ? (
        <LoadingSpinner />
      ) : (
        <>
          <Head>
            <title>Test - {song.title}</title>
          </Head>
          <TypingTest song={song} textSize={textSize} letter={letter} />
        </>
      )}
      <LetterSize setLetter={setLetter} textSize={textSize} />
    </div>
  );
}
