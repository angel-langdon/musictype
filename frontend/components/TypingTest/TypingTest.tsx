import { Song } from "api/models";
import { useRef } from "react";
import { memo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import Lyrics from "./Lyrics";

export interface TypingTestProps {
  song: Song;
  letter: { height: number; width: number };
  textSize: string;
}

const TypingTest = memo(({ song, letter, textSize }: TypingTestProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-y-5  p-10 pretty-container bg-slate-700">
      <div className="text-slate-400">
        {song.title} | {song.author}
      </div>
      <div
        onClick={() => ref.current && ref.current.focus()}
        style={{ height: letter.height * 10, width: "60vw" }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <Lyrics
              height={height}
              width={width}
              value={value}
              {...{ song, letter, textSize }}
            />
          )}
        </AutoSizer>

        <input
          ref={ref}
          className="fixed"
          style={{ left: -1000 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
});

export default TypingTest;
