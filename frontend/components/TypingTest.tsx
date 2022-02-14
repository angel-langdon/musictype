import { useState } from "react";
import { Song } from "api/models";
import SongSelect from "./SongSelect";

export default function TypingTest() {
  const [song, setSong] = useState<Song | null>(null);
  if (!song) return <SongSelect setSong={setSong} />;
  return <div className="flex w-[80vw] bg-slate-50"></div>;
}
