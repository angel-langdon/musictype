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
import useScrollbarSize from "react-scrollbar-size";

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
  line: string,
  letter: TypingTestProps["letter"],
  width: number
) {
  let lineCount = 1;
  let charsCount = 0;
  const maxCharsPerLine = Math.trunc(width / letter.width) - 1; // -1 temp fix for line overlapping
  const words = line.split(" ");
  words.forEach((word, idx) => {
    const htmlTextLengh = word.length + 1; // + 1 for space
    charsCount += htmlTextLengh;
    const isLastWord = idx + 1 == words.length;
    if (charsCount > maxCharsPerLine) {
      lineCount += 1;
      charsCount = htmlTextLengh;
    } else if (charsCount == maxCharsPerLine && !isLastWord) {
      charsCount = 0;
      lineCount += 1;
    }
  });
  return lineCount * letter.height;
}

function useUpdateItemSize(
  listRef: MutableRefObject<List | null>,
  width: number,
  scrollbarWidth: number,
  letter: TypingTestProps["letter"]
) {
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.resetAfterIndex(0);
  }, [width, scrollbarWidth, letter]);
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
  const { width: scrollbarWidth } = useScrollbarSize();
  useUpdateItemSize(listRef, width, scrollbarWidth, letter);

  function Line({ index, style }: { index: number; style: CSSProperties }) {
    let letterIdx = cumLength[index];
    const words = lines[index].split(" ").map((word, wordIdx) => {
      return (
        <div className="flex" key={`${index}-${wordIdx}`}>
          {Array.from(`${word} `).map((songLetter) => {
            letterIdx++;
            return (
              <Letter
                key={letterIdx}
                songLetter={songLetter}
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
    // @ts-ignore
    <List
      ref={listRef}
      height={height}
      width={width + scrollbarWidth}
      itemCount={lines.length}
      itemSize={(idx) => getItemSize(lines[idx], letter, width)}
    >
      {Line}
    </List>
  );
}
