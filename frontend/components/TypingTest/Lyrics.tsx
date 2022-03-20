import {
  CSSProperties,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Letter from "./Letter";
import { VariableSizeList as List } from "react-window";
import { TypingTestProps } from "./TypingTest";

interface LyricsProps extends TypingTestProps {
  value: string;
  height: number;
  width: number;
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

function useUpdateItemSize(
  listRef: MutableRefObject<List | null>,
  width: number
) {
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.resetAfterIndex(0);
  }, [width]);
}

export default function Lyrics({
  value,
  song,
  letter,
  textSize,
  height,
  width,
}: LyricsProps) {
  const listRef = useRef<List>(null);
  const lines = useMemo(() => song.lyrics.split("\n"), [song.lyrics]);
  const cumLength = useCumLength(lines);
  useUpdateItemSize(listRef, width);

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
    <List
      ref={listRef}
      height={height}
      width={width}
      itemCount={lines.length}
      itemSize={(idx) => getItemSize(lines[idx].length + 1, letter, width)}
    >
      {Line}
    </List>
  );
}