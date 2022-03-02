import { Song } from "api/models";
import { useMemo } from "react";
import { useRef } from "react";
import { memo, useState } from "react";
import Letter from "./Letter";

interface TypingTestProps {
  song: Song;
  letter: { height: number; width: number };
  textSize: string;
}

const TypingTest = memo(({ song, letter, textSize }: TypingTestProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const lines = useMemo(() => song.lyrics.split("\n"), [song.lyrics]);
  let letterIdx = -1;
  return (
    <div
      className="flex flex-col gap-y-5  p-10 pretty-container bg-slate-700"
      style={{ width: "60vw" }}
    >
      <div className="text-slate-400">
        {song.title} | {song.author}
      </div>
      <div
        className="overflow-scroll"
        onClick={() => ref.current && ref.current.focus()}
        style={{ height: letter.height * 10 }}
      >
        <div className="flex flex-col flex-grow">
          {lines.map((line, line_idx) => (
            <div className={`${textSize} flex flex-wrap`} key={line_idx}>
              {line.split(" ").map((word) => {
                return (
                  <div className="flex">
                    {Array.from(`${word} `).map((letter) => {
                      letterIdx++;
                      return (
                        <Letter
                          key={letterIdx}
                          songLetter={letter}
                          writtenLetter={value[letterIdx]}
                          isLetterActive={value.length === letterIdx}
                        />
                      );
                    })}
                  </div>
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
