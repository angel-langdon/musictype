import { Song } from "api/models";
import { CSSProperties, useMemo } from "react";
import { useRef } from "react";
import { memo, useState } from "react";
import Letter from "./Letter";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface TypingTestProps {
  song: Song;
  letter: { height: number; width: number };
  textSize: string;
}

function useCumLength(lines: string[]) {
  return useMemo(() => {
    let letterIdx = -1;
    return lines.map((_, idx) => {
      const prevLength =
        lines[idx - 1] === undefined ? 0 : lines[idx - 1].length + 1;
      letterIdx += prevLength;
      return letterIdx;
    });
  }, [lines]);
}

function getItemSize(
  lineLength: number,
  letter: TypingTestProps["letter"],
  width: number
) {
  const maxChars = Math.floor(width / letter.width);
  const lineCount = Math.ceil(lineLength / maxChars);
  return lineCount * letter.height;
}

const TypingTest = memo(({ song, letter, textSize }: TypingTestProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const lines = useMemo(() => song.lyrics.split("\n"), [song.lyrics]);
  const cumLength = useCumLength(lines);

  function Line({ index, style }: { index: number; style: CSSProperties }) {
    let letterIdx = cumLength[index];
    const words = lines[index].split(" ").map((word, wordIdx) => {
      return (
        <div className="flex" key={`${index}-${wordIdx}`}>
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
    });
    return (
      <div className={`flex flex-wrap ${textSize}`} style={style}>
        {words}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-5  p-10 pretty-container bg-slate-700">
      <div className="text-slate-400">
        {song.title} | {song.author}
      </div>
      <div
        className="overflow-scroll"
        onClick={() => ref.current && ref.current.focus()}
        style={{ height: letter.height * 10, width: "60vw" }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={lines.length}
              itemSize={(idx) => getItemSize(lines[idx].length, letter, width)}
            >
              {Line}
            </List>
          )}
        </AutoSizer>
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
