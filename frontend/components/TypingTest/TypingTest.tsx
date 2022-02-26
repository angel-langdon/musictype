import { Song } from "api/models";
import { useMemo } from "react";
import { useRef } from "react";
import { memo, useState } from "react";
import Letter from "./Letter";

interface TypingTestProps {
  song: Song;
  letterHeight: number;
  textSize: string;
}

const TypingTest = memo(({ song, letterHeight, textSize }: TypingTestProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const lines = useMemo(() => song.lyrics.split("\n"), [song.lyrics]);
  let letterIdx = -1;
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        {song.title} - {song.author}
      </div>
      <div
        className="w-[60vw] overflow-scroll"
        style={{ height: letterHeight * 10 }}
        onClick={() => ref.current && ref.current.focus()}
      >
        <div className="flex flex-col flex-grow">
          {lines.map((line, line_idx) => (
            <div className={`${textSize} flex flex-wrap`} key={line_idx}>
              {`${line} `.split("").map((letter) => {
                letterIdx++;
                return (
                  <Letter
                    key={letterIdx}
                    songLetter={letter}
                    writtenLetter={value[letterIdx]}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <input
        ref={ref}
        className="fixed"
        style={{ left: -1000 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
});

export default TypingTest;
