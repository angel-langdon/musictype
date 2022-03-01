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

function useContainerSize(
  lines: string[],
  letter: TypingTestProps["letter"]
): { width: string; height: number } {
  return useMemo(() => {
    if (lines.length === 0) return { width: "0px", height: 0 };
    let sum = 0;
    lines.forEach((line) => (sum += line.length));
    const meanLength = sum / lines.length;
    return {
      width: `min(${(meanLength + 10) * letter.width}px, 80vw)`,
      height: letter.height * 10,
    };
  }, [lines, letter]);
}

const TypingTest = memo(({ song, letter, textSize }: TypingTestProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const lines = useMemo(() => song.lyrics.split("\n"), [song.lyrics]);
  const { width, height } = useContainerSize(lines, letter);
  let letterIdx = -1;
  return (
    <div className="flex flex-col gap-y-5" style={{ width }}>
      <div>
        {song.title} | {song.author}
      </div>
      <div
        className="overflow-scroll"
        onClick={() => ref.current && ref.current.focus()}
        style={{ height }}
      >
        <div className="flex flex-col flex-grow">
          {lines.map((line, line_idx) => (
            <div className={`${textSize} flex flex-wrap`} key={line_idx}>
              {Array.from(`${line} `).map((letter) => {
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
