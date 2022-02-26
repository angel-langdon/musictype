import { Song } from "api/models";
import { createContext, ReactNode, useContext, useState } from "react";

function useSongState() {
  const [song, setSong] = useState<Song | null>(null);

  return {
    song,
    setSong,
  };
}

export type ISongContext = ReturnType<typeof useSongState>;
const SongContext = createContext<ISongContext>(null!);

export default function SongProvider({ children }: { children: ReactNode }) {
  const songState = useSongState();
  return (
    <SongContext.Provider value={songState}>{children}</SongContext.Provider>
  );
}

export function useSongContext(): ISongContext {
  return useContext(SongContext);
}
